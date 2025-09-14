import xarray as xr
import numpy as np
import pandas as pd
from datetime import datetime
import os
from pathlib import Path
import glob


def safe_decode(val):
    """Helper function to decode byte strings safely."""
    if isinstance(val, bytes):
        return val.decode().strip()
    elif isinstance(val, np.bytes_):
        return val.decode().strip()
    return str(val).strip() if val is not None else ''


def process_netcdf_file(file_path, verbose=False):
    """
    Process a single NetCDF file and return a DataFrame with ARGO profile data.
    
    Args:
        file_path (str): Path to the NetCDF file
        verbose (bool): Print debugging information
        
    Returns:
        pd.DataFrame: Processed ARGO data or None if processing fails
    """
    try:
        # Load dataset
        ds = xr.open_dataset(file_path)
        
        if verbose:
            print(f"Processing: {file_path}")
            print("Available variables:", list(ds.data_vars.keys()))
            print("Dataset dimensions:", dict(ds.dims))

        # 1. Extract georeferenced 1D arrays (one per profile)
        lat = ds['LATITUDE'].values if 'LATITUDE' in ds else None
        lon = ds['LONGITUDE'].values if 'LONGITUDE' in ds else None
        juld = ds['JULD'].values if 'JULD' in ds else None
        platform_numbers = ds['PLATFORM_NUMBER'].values if 'PLATFORM_NUMBER' in ds else None
        cycle_numbers = ds['CYCLE_NUMBER'].values if 'CYCLE_NUMBER' in ds else None

        # 2. Convert JULD to list of ISO datetime strings
        if juld is not None:
            raw = juld
            if np.issubdtype(raw.dtype, np.datetime64):
                datetimes = pd.to_datetime(raw).strftime('%Y-%m-%d %H:%M:%S').tolist()
            else:
                datetimes = pd.to_datetime(raw, unit='D', origin='1950-01-01') \
                              .strftime('%Y-%m-%d %H:%M:%S').tolist()
        else:
            datetimes = [''] * (lat.shape[0] if lat is not None else 0)

        # 3. Extract core 2D measurement arrays (profiles x levels)
        pres = ds['PRES_ADJUSTED'].values if 'PRES_ADJUSTED' in ds else ds['PRES'].values
        temp = ds['TEMP_ADJUSTED'].values if 'TEMP_ADJUSTED' in ds else ds['TEMP'].values
        sal = ds['PSAL_ADJUSTED'].values if 'PSAL_ADJUSTED' in ds else ds['PSAL'].values

        # 4. Extract QC arrays
        pres_qc = ds['PRES_ADJUSTED_QC'].values if 'PRES_ADJUSTED_QC' in ds else ds.get('PRES_QC', np.full_like(pres, '1')).values
        temp_qc = ds['TEMP_ADJUSTED_QC'].values if 'TEMP_ADJUSTED_QC' in ds else ds.get('TEMP_QC', np.full_like(temp, '1')).values
        sal_qc = ds['PSAL_ADJUSTED_QC'].values if 'PSAL_ADJUSTED_QC' in ds else ds.get('PSAL_QC', np.full_like(sal, '1')).values

        # 5. Extract 1D metadata arrays
        project_names = ds['PROJECT_NAME'].values if 'PROJECT_NAME' in ds else None
        pi_names = ds['PI_NAME'].values if 'PI_NAME' in ds else None
        platform_types = ds['PLATFORM_TYPE'].values if 'PLATFORM_TYPE' in ds else None
        data_modes = ds['DATA_MODE'].values if 'DATA_MODE' in ds else None
        data_centres = ds['DATA_CENTRE'].values if 'DATA_CENTRE' in ds else None

        # 6. BGC Detection - Check what's actually available
        if verbose:
            print("\n=== BGC PARAMETER DETECTION ===")
        
        bgc_vars = {}
        bgc_qc_vars = {}

        # Extended BGC parameter list with common variations
        all_possible_bgc = [
            'DOXY', 'DOXY2',  # Dissolved Oxygen
            'CHLA', 'FLUORESCENCE_CHLA',  # Chlorophyll-a
            'NITRATE',  # Nitrate
            'PH_IN_SITU_TOTAL', 'PH_IN_SITU_FREE',  # pH
            'BBP700', 'BBP532',  # Backscattering
            'CDOM', 'FDOM',  # Colored/Fluorescent Dissolved Organic Matter
            'TURBIDITY',  # Turbidity
            'CP660',  # Beam attenuation
            'DOWN_IRRADIANCE412', 'DOWN_IRRADIANCE443', 'DOWN_IRRADIANCE490', 'DOWN_IRRADIANCE555',
            'DOWNWELLING_PAR',  # Photosynthetically Available Radiation
            'BISULFIDE',  # Hydrogen Sulfide
            'TRANSMITTANCE_PARTICLE_BEAM_ATTENUATION660'
        ]

        # Check all variables in dataset for BGC parameters
        available_vars = list(ds.data_vars.keys())
        if verbose:
            print(f"Total variables in dataset: {len(available_vars)}")

        found_bgc_vars = []
        for var in available_vars:
            # Check if it's a BGC variable (not core P/T/S)
            if var not in ['PRES', 'TEMP', 'PSAL', 'PRES_ADJUSTED', 'TEMP_ADJUSTED', 'PSAL_ADJUSTED']:
                # Check if it's measurement data (has N_LEVELS dimension)
                if hasattr(ds[var], 'dims') and 'N_LEVELS' in ds[var].dims:
                    if not var.endswith('_QC') and not var.endswith('_ERROR'):
                        found_bgc_vars.append(var)

        if verbose:
            print(f"Potential BGC variables found: {found_bgc_vars}")

        # Extract found BGC variables
        for var in found_bgc_vars:
            try:
                # Check for adjusted version first
                adj_var = f"{var}_ADJUSTED"
                if adj_var in ds:
                    bgc_vars[var.lower()] = ds[adj_var].values
                    # Look for QC flag
                    qc_var = f"{adj_var}_QC"
                    if qc_var in ds:
                        bgc_qc_vars[f"{var.lower()}_qc"] = ds[qc_var].values
                else:
                    bgc_vars[var.lower()] = ds[var].values
                    # Look for QC flag
                    qc_var = f"{var}_QC"
                    if qc_var in ds:
                        bgc_qc_vars[f"{var.lower()}_qc"] = ds[qc_var].values
                
                if verbose:
                    print(f"✅ Extracted BGC variable: {var}")
            except Exception as e:
                if verbose:
                    print(f"❌ Failed to extract {var}: {e}")

        if verbose:
            print(f"\n🔬 BGC variables successfully extracted: {list(bgc_vars.keys())}")
            print(f"📊 BGC QC variables: {list(bgc_qc_vars.keys())}")

        # Check if this file has any BGC data at all
        if not bgc_vars and verbose:
            print("⚠️  NO BGC DATA FOUND - This appears to be a CORE-only ARGO file")

        # 7. Flatten into rows
        rows = []
        n_profiles = lat.shape[0] if lat is not None else 0
        n_levels = pres.shape[1] if pres.ndim == 2 else pres.shape[0]

        if verbose:
            print(f"\n📈 Processing {n_profiles} profiles with up to {n_levels} levels each...")

        for i in range(n_profiles):
            plat, cyc = '', ''
            if platform_numbers is not None: 
                plat = safe_decode(platform_numbers[i])
            if cycle_numbers is not None and not np.isnan(cycle_numbers[i]):
                cyc = int(cycle_numbers[i])
            
            date_str = datetimes[i] if i < len(datetimes) else ''
            p_lat = lat[i] if lat is not None else np.nan
            p_lon = lon[i] if lon is not None else np.nan
            if np.isnan(p_lat) or np.isnan(p_lon): 
                continue
            
            proj = safe_decode(project_names[i]) if project_names is not None else ''
            pi = safe_decode(pi_names[i]) if pi_names is not None else ''
            ptype = safe_decode(platform_types[i]) if platform_types is not None else ''
            mode = safe_decode(data_modes[i]) if data_modes is not None else ''
            dc = safe_decode(data_centres[i]) if data_centres is not None else ''
            
            for j in range(n_levels):
                pr = pres[i, j] if pres.ndim == 2 else pres[j]
                te = temp[i, j] if temp.ndim == 2 else temp[j]
                sa = sal[i, j] if sal.ndim == 2 else sal[j]
                
                if np.isnan(pr) or np.isnan(te) or np.isnan(sa): 
                    continue
                
                pr_qc = safe_decode(pres_qc[i, j]) if pres_qc.ndim == 2 else safe_decode(pres_qc[j])
                te_qc = safe_decode(temp_qc[i, j]) if temp_qc.ndim == 2 else safe_decode(temp_qc[j])
                sa_qc = safe_decode(sal_qc[i, j]) if sal_qc.ndim == 2 else safe_decode(sal_qc[j])
                
                row = {
                    'profile_id': i,
                    'float_id': plat,
                    'cycle_number': cyc,
                    'latitude': p_lat,
                    'longitude': p_lon,
                    'datetime': date_str,
                    'pressure': pr,
                    'temperature': te,
                    'salinity': sa,
                    'pressure_qc': pr_qc,
                    'temperature_qc': te_qc,
                    'salinity_qc': sa_qc,
                    'project_name': proj,
                    'pi_name': pi,
                    'platform_type': ptype,
                    'data_mode': mode,
                    'data_centre': dc
                }
                
                # Add BGC if exists
                for name, arr in bgc_vars.items():
                    if arr.ndim == 2:
                        val = arr[i, j]
                    else:
                        val = arr[j] if j < len(arr) else np.nan
                    
                    row[name] = None if np.isnan(val) else val
                    
                    # Add QC flag if available
                    qc_key = f"{name}_qc"
                    if qc_key in bgc_qc_vars:
                        qcarr = bgc_qc_vars[qc_key]
                        if qcarr.ndim == 2:
                            qcval = qcarr[i, j]
                        else:
                            qcval = qcarr[j] if j < len(qcarr) else '9'
                        row[qc_key] = safe_decode(qcval)
                
                rows.append(row)

        # Close the dataset
        ds.close()

        # 8. Build DataFrame
        df = pd.DataFrame(rows)
        
        if verbose:
            print(f"\n📊 RESULTS:")
            print(f"Total measurements: {len(df)}")
            print(f"Columns: {len(df.columns)}")
            print(f"BGC columns found: {len([col for col in df.columns if col not in ['profile_id', 'float_id', 'cycle_number', 'latitude', 'longitude', 'datetime', 'pressure', 'temperature', 'salinity', 'pressure_qc', 'temperature_qc', 'salinity_qc', 'project_name', 'pi_name', 'platform_type', 'data_mode', 'data_centre']])}")

            # Show first few datetime values
            print(f"\nDatetime range:")
            valid_dates = df[df['datetime'] != '']['datetime']
            if len(valid_dates) > 0:
                print(f"  First: {valid_dates.iloc[0]}")
                print(f"  Last: {valid_dates.iloc[-1]}")

        return df

    except Exception as e:
        print(f"❌ Error processing {file_path}: {str(e)}")
        return None


def find_netcdf_files(root_dir):
    """
    Recursively find all NetCDF files in the given directory.
    
    Args:
        root_dir (str): Root directory to search
        
    Returns:
        list: List of NetCDF file paths
    """
    netcdf_files = []
    root_path = Path(root_dir)
    
    if not root_path.exists():
        print(f"❌ Directory does not exist: {root_dir}")
        return netcdf_files
    
    # Find all .nc files recursively
    for nc_file in root_path.rglob("*.nc"):
        netcdf_files.append(str(nc_file))
    
    return sorted(netcdf_files)


def create_output_path(input_file_path, input_root, output_root):
    """
    Create the corresponding output path for a CSV file, maintaining directory structure.
    
    Args:
        input_file_path (str): Path to input NetCDF file
        input_root (str): Root directory of input files
        output_root (str): Root directory for output files
        
    Returns:
        str: Output CSV file path
    """
    input_path = Path(input_file_path)
    input_root_path = Path(input_root)
    output_root_path = Path(output_root)
    
    # Get relative path from input root
    relative_path = input_path.relative_to(input_root_path)
    
    # Change extension to .csv
    csv_filename = relative_path.stem + '.csv'
    output_dir = output_root_path / relative_path.parent
    
    # Create output directory if it doesn't exist
    output_dir.mkdir(parents=True, exist_ok=True)
    
    return str(output_dir / csv_filename)


def process_all_argo_files():
    """
    Process all NetCDF files in the argo_data directory and create corresponding CSV files.
    """
    # Define paths
    current_dir = Path(__file__).parent
    input_root = current_dir.parent.parent.parent / "argo_data"
    output_root = current_dir / "argo_data"
    
    print(f"Input directory: {input_root}")
    print(f"Output directory: {output_root}")
    
    # Find all NetCDF files
    netcdf_files = find_netcdf_files(str(input_root))
    
    if not netcdf_files:
        print("❌ No NetCDF files found in the argo_data directory!")
        return
    
    print(f"Found {len(netcdf_files)} NetCDF files to process.")
    
    processed_count = 0
    failed_count = 0
    
    for i, nc_file in enumerate(netcdf_files, 1):
        try:
            print(f"\n[{i}/{len(netcdf_files)}] Processing: {Path(nc_file).name}")
            
            # Process the NetCDF file
            df = process_netcdf_file(nc_file, verbose=False)
            
            if df is not None and not df.empty:
                # Create output path
                output_path = create_output_path(nc_file, str(input_root), str(output_root))
                
                # Save CSV
                df.to_csv(output_path, index=False)
                print(f"✅ Saved CSV: {output_path} ({len(df)} measurements)")
                processed_count += 1
            else:
                print(f"⚠️  No data extracted from {nc_file}")
                failed_count += 1
                
        except Exception as e:
            print(f"❌ Failed to process {nc_file}: {str(e)}")
            failed_count += 1
    
    print(f"\n🎉 Processing complete!")
    print(f"✅ Successfully processed: {processed_count} files")
    print(f"❌ Failed to process: {failed_count} files")
    print(f"📁 Output directory: {output_root}")


if __name__ == "__main__":
    # Process all ARGO files
    process_all_argo_files()
    
    # Alternatively, you can process a single file like this:
    # df = process_netcdf_file('20250101_prof.nc', verbose=True)
    # if df is not None:
    #     df.to_csv('single_file_output.csv', index=False)
    #     print("Single file processed successfully!")
