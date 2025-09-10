import xarray as xr
import numpy as np
import pandas as pd

ds = xr.open_dataset('20250101_prof.nc')
# Get arrays
lat = ds['LATITUDE'].values    # shape: (N_PROF,)
lon = ds['LONGITUDE'].values   # shape: (N_PROF,)
pres = ds['PRES'].values       # shape: (N_PROF, N_LEVELS)
temp = ds['TEMP'].values       # shape: (N_PROF, N_LEVELS)
sal = ds['PSAL'].values        # shape: (N_PROF, N_LEVELS)

# Create a flat table of all valid measurements
rows = []
for i in range(lat.shape[0]):  # Loop over profiles
    for j in range(pres.shape[1]):  # Loop over depth levels
        if not (np.isnan(lat[i]) or np.isnan(lon[i]) or np.isnan(pres[i, j]) or np.isnan(temp[i, j]) or np.isnan(sal[i, j])):
            rows.append({
                'profile': i,
                'latitude': lat[i],
                'longitude': lon[i],
                'pressure': pres[i, j],
                'temperature': temp[i, j],
                'salinity': sal[i, j]
            })

# Turn into a pandas DataFrame for easy viewing
df = pd.DataFrame(rows)
print(df.head())
df.to_csv('argo_profiles.csv', index=False)
