from pydantic_ai import Tool#, WebSearchTool, CodeExecutionTool
#from pydantic_ai.common_tools.tavily import tavily_search_tool
# https://ai.pydantic.dev/third-party-tools/

from app.schemas.chat import AgentDependencies
from argopy import DataFetcher as ArgoDataFetcher
import xarray as xr

import geopandas as gpd

from typing import Callable
from loguru import logger

def fetch_argo_data(lon_min, lon_max, lat_min, lat_max, pres_min, pres_max, datim_min, datim_max):
    """
    Fetch Argo data for a specified region and time period.
    
    Parameters:
    lon_min, lon_max: Longitude bounds
    lat_min, lat_max: Latitude bounds
    pres_min, pres_max: Pressure bounds
    datim_min, datim_max: Date-time bounds (e.g., '2011-01', '2011-06')
    
    Returns:
    xarray.Dataset containing the fetched data.
    """
    logger.info(f"Fetching Argo data for region: lon({lon_min}, {lon_max}), lat({lat_min}, {lat_max}), pres({pres_min}, {pres_max}), datim({datim_min}, {datim_max})")
    ds = ArgoDataFetcher().region([lon_min, lon_max, lat_min, lat_max, pres_min, pres_max, datim_min, datim_max]).to_xarray()
    return ds

def get_n_nearest_floats(lon, lat, n=1):
    """
    Get the nearest Argo float profiles to a specified location.
    
    Parameters:
    lon, lat: Longitude and Latitude of the target location.
    n: Number of nearest floats to retrieve.
    
    Returns:
    xarray.Dataset containing the nearest float profiles.
    """
    ds = ArgoDataFetcher().float([lon, lat]).to_xarray()
    return ds

# def get_sea_bounds(sea_name: str, shapefile_path: str) -> dict:
#     # Load shapefile
#     gdf = gpd.read_file(shapefile_path)

#     # Case-insensitive search
#     match = gdf[gdf['NAME'].str.lower() == sea_name.lower()]
#     if match.empty:
#         raise ValueError(f"No sea/ocean named '{sea_name}' found in dataset.")

#     # Get bounding box of the first match
#     minx, miny, maxx, maxy = match.geometry.iloc[0].bounds
#     return {
#         "lat_min": miny,
#         "lat_max": maxy,
#         "lon_min": minx,
#         "lon_max": maxx,
#     }

# Example
#bounds = get_sea_bounds("Mediterranean Sea", "ne_10m_geography_marine_polys.shp")
#print(bounds)

all_tools: list[Tool] = [
    Tool(fetch_argo_data, takes_ctx=False)
]

if __name__ == "__main__":
    # Example usage
    ds = fetch_argo_data(-10, 10, 30, 45, 0, 1000, '2011-01', '2011-06')
    print(ds)