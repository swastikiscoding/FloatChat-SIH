from argopy import DataFetcher as ArgopyDataFetcher
from loguru import logger
df = ArgopyDataFetcher(src='argovis')

logger.info("2")
ds = df.float(1900857).to_xarray()
logger.info("3")