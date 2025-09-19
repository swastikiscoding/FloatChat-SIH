from argopy import DataFetcher as ArgopyDataFetcher
from loguru import logger
import argopy
argopy.set_options(timeout=120)  # Set timeout to 120 seconds

fetcher = ArgopyDataFetcher() # Takes ∞ time to initialize, so do it once here

logger.info("Testing Argopy DataFetcher with a sample region...")
data = fetcher.region([20.0, 146.92, -60.0, 30.0, 0.0, 1000.0]).to_xarray()
logger.info(f"Sample region data loaded successfully with dimensions: {data.dims}")