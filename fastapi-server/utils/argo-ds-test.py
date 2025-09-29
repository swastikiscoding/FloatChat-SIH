from argopy import DataFetcher as ArgopyDataFetcher
from loguru import logger
df = ArgopyDataFetcher(src='erddap', dataset='bgc', mode='expert')

ds = df.region([-75, -45, 20, 30, 0, 10, '2021-01', '2021-06']).to_dataframe()

print(ds)