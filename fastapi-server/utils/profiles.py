import xarray as xr
import numpy as np
import pandas as pd
from datetime import datetime

# Load dataset
ds = xr.open_dataset('20250101_prof.nc')

# Print available variables for reference
print("Available variables:", list(ds.data_vars.keys()))

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
sal  = ds['PSAL_ADJUSTED'].values if 'PSAL_ADJUSTED' in ds else ds['PSAL'].values

# 4. Extract QC arrays
pres_qc = ds['PRES_ADJUSTED_QC'].values if 'PRES_ADJUSTED_QC' in ds else ds.get('PRES_QC', np.full_like(pres, '1')).values
temp_qc = ds['TEMP_ADJUSTED_QC'].values if 'TEMP_ADJUSTED_QC' in ds else ds.get('TEMP_QC', np.full_like(temp, '1')).values
sal_qc  = ds['PSAL_ADJUSTED_QC'].values if 'PSAL_ADJUSTED_QC' in ds else ds.get('PSAL_QC', np.full_like(sal, '1')).values

# 5. Extract 1D metadata arrays
project_names = ds['PROJECT_NAME'].values if 'PROJECT_NAME' in ds else None
pi_names      = ds['PI_NAME'].values     if 'PI_NAME' in ds else None
platform_types= ds['PLATFORM_TYPE'].values if 'PLATFORM_TYPE' in ds else None
data_modes    = ds['DATA_MODE'].values    if 'DATA_MODE' in ds else None
data_centres  = ds['DATA_CENTRE'].values  if 'DATA_CENTRE' in ds else None

# 6. Detect and extract BGC parameters
bgc_vars = {}
bgc_qc_vars = {}
common_bgc = ['DOXY','CHLA','NITRATE','PH_IN_SITU_TOTAL','BBP700','CDOM']
for var in common_bgc:
    if var in ds:
        adj = f"{var}_ADJUSTED"
        if adj in ds:
            bgc_vars[var.lower()] = ds[adj].values
            bgc_qc_vars[f"{var.lower()}_qc"] = ds.get(f"{adj}_QC",
                np.full_like(ds[adj].values, '1')).values
        else:
            bgc_vars[var.lower()] = ds[var].values
            bgc_qc_vars[f"{var.lower()}_qc"] = ds.get(f"{var}_QC",
                np.full_like(ds[var].values, '1')).values

print("BGC variables detected:", list(bgc_vars.keys()))

# Helper to decode byte strings
def safe_decode(val):
    if isinstance(val, bytes):
        return val.decode().strip()
    return str(val).strip() if val is not None else ''

# 7. Flatten into rows
rows = []
n_profiles = lat.shape[0] if lat is not None else 0
n_levels   = pres.shape[1] if pres.ndim==2 else pres.shape[0]

for i in range(n_profiles):
    plat, cyc = '', ''
    if platform_numbers is not None: plat = safe_decode(platform_numbers[i])
    if cycle_numbers is not None and not np.isnan(cycle_numbers[i]):
        cyc = int(cycle_numbers[i])
    date_str = datetimes[i] if i < len(datetimes) else ''
    p_lat = lat[i] if lat is not None else np.nan
    p_lon = lon[i] if lon is not None else np.nan
    if np.isnan(p_lat) or np.isnan(p_lon): continue
    
    proj = safe_decode(project_names[i]) if project_names is not None else ''
    pi   = safe_decode(pi_names[i])      if pi_names is not None else ''
    ptype= safe_decode(platform_types[i])if platform_types is not None else ''
    mode = safe_decode(data_modes[i])    if data_modes is not None else ''
    dc   = safe_decode(data_centres[i])  if data_centres is not None else ''
    
    for j in range(n_levels):
        pr = pres[i,j] if pres.ndim==2 else pres[j]
        te = temp[i,j] if temp.ndim==2 else temp[j]
        sa = sal[i,j]  if sal.ndim==2  else sal[j]
        if np.isnan(pr) or np.isnan(te) or np.isnan(sa): continue
        
        pr_qc = safe_decode(pres_qc[i,j]) if pres_qc.ndim==2 else safe_decode(pres_qc[j])
        te_qc = safe_decode(temp_qc[i,j]) if temp_qc.ndim==2 else safe_decode(temp_qc[j])
        sa_qc = safe_decode(sal_qc[i,j])   if sal_qc.ndim==2  else safe_decode(sal_qc[j])
        
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
            val = arr[i,j] if arr.ndim==2 else arr[j]
            row[name] = None if np.isnan(val) else val
            qcarr = bgc_qc_vars.get(f"{name}_qc")
            if qcarr is not None:
                qcval = qcarr[i,j] if qcarr.ndim==2 else qcarr[j]
                row[f"{name}_qc"] = safe_decode(qcval)
        
        rows.append(row)

# 8. Build DataFrame and export
df = pd.DataFrame(rows)
print("Total measurements:", len(df))
print("Columns:", df.columns.tolist())
print(df[['datetime']].head())

df.to_csv('argo_comprehensive_data.csv', index=False)
print("Saved to argo_comprehensive_data.csv")
