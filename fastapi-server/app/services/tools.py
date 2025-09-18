from pydantic_ai import Tool, RunContext

#, WebSearchTool, CodeExecutionTool
#from pydantic_ai.common_tools.tavily import tavily_search_tool
# https://ai.pydantic.dev/third-party-tools/

from app.schemas.chat import AgentDependencies
from argopy import DataFetcher as ArgopyDataFetcher
import duckdb
import xarray as xr

import geopandas as gpd
import pandas as pd

from typing import Callable
from loguru import logger

fetcher = ArgopyDataFetcher() # Takes ∞ time to initialize, so do it once here

def load_argo_profile(
    ctx: RunContext[AgentDependencies],
    profile: int,
    cyc: int
) -> str:
    """Load Argo data for a specific profile and cycle."""
    logger.info(f"Loading Argo profile data: profile={profile}, cyc={cyc}")
    data = fetcher.profile(profile, cyc).to_xarray()
    desc = f"Argo profile {profile}, cycle {cyc}"
    df = data.to_dataframe().reset_index()
    ref = ctx.deps.store(df)
    output = [
        f'Loaded Argo data as `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data: {desc}, rows={len(df)}")
    return '\n'.join(output)

def load_argo_float(
    ctx: RunContext[AgentDependencies],
    float_id: int
) -> str:
    """Load Argo data for a specific float."""
    logger.info(f"Loading Argo float data: float={float_id}")
    data = fetcher.float(float_id).to_xarray()
    desc = f"Argo float {float_id}"
    df = data.to_dataframe().reset_index()
    ref = ctx.deps.store(df)
    output = [
        f'Loaded Argo data as `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data: {desc}, rows={len(df)}")
    return '\n'.join(output)

def load_argo_region(
    ctx: RunContext[AgentDependencies],
    box: list[float | str] # no int!
) -> str:
    """Load Argo data for a specific region (box).
    The box list is made of:
        lon_min: float, lon_max: float,
        lat_min: float, lat_max: float,
        dpt_min: float, dpt_max: float,
        date_min: str (optional), date_max: str (optional)
    Longitude, latitude and pressure bounds are required, while the two bounding dates are optional.
    If bounding dates are not specified, the entire time series is fetched.
    Eg: [-60.0, -55.0, 40.0, 45.0, 0.0, 10.0, '2007-08-01', '2007-09-01']
    Eg: [20.0, 146.92, -60.0, 30.0, 0.0, 1000.0]
    """
    logger.info(f"Loading Argo region data: box={box}")
    data = fetcher.region(box).to_xarray()
    desc = f"Argo region {box}"
    df = data.to_dataframe().reset_index()
    ref = ctx.deps.store(df)
    output = [
        f'Loaded Argo data as `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data: {desc}, rows={len(df)}")
    return '\n'.join(output)


def run_duckdb(ctx: RunContext[AgentDependencies], dataset: str, sql: str) -> str:
    """Run DuckDB SQL query on the DataFrame.

    Note that the virtual table name used in DuckDB SQL must be `dataset`.

    Args:
        ctx: Pydantic AI agent RunContext
        dataset: reference string to the DataFrame
        sql: the query to be executed using DuckDB
    """
    logger.info(f"Running DuckDB SQL on dataset={dataset}, sql={sql}")
    data = ctx.deps.get(dataset)
    result = duckdb.query_df(df=data, virtual_table_name='dataset', sql_query=sql)
    # pass the result as ref (because DuckDB SQL can select many rows, creating another huge dataframe)
    ref = ctx.deps.store(result.df())  # pyright: ignore[reportUnknownMemberType]
    logger.info(f"DuckDB query result stored as {ref}, rows={len(result.df())}")  # pyright: ignore[reportUnknownMemberType]
    return f'Executed SQL, result is `{ref}`'


def display(ctx: RunContext[AgentDependencies], name: str) -> str:
    """Display at most 5 rows of the dataframe."""
    logger.info(f"Displaying dataset={name}")
    dataset = ctx.deps.get(name)
    return dataset.head().to_string()  # pyright: ignore[reportUnknownMemberType]


all_tools = [
    load_argo_float,
    load_argo_profile,
    load_argo_region,
    run_duckdb,
    display,
]


if __name__ == "__main__":
    pass