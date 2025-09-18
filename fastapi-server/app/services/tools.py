from pydantic_ai import Tool, RunContext

#, WebSearchTool, CodeExecutionTool
#from pydantic_ai.common_tools.tavily import tavily_search_tool
# https://ai.pydantic.dev/third-party-tools/

from app.schemas.chat import AgentDependencies
from argopy import DataFetcher as ArgoDataFetcher
import duckdb
import xarray as xr

import geopandas as gpd
import pandas as pd

from typing import Callable
from loguru import logger


def load_argo_data(
    ctx: RunContext[AgentDependencies],
    mode: str = 'profile',
    **kwargs
) -> str:
    """Load Argo data using argopy DataFetcher.

    Args:
        ctx: Pydantic AI agent RunContext
        mode: 'profile', 'float', or 'region' (default: 'profile')
        kwargs: parameters for the DataFetcher (e.g., WMO, box, etc.)
    """
    logger.info(f"Loading Argo data with mode={mode}, params={kwargs}")

    fetcher = ArgoDataFetcher()
    if mode == 'profile':
        # Example: profile=6902746, cyc=1
        profile = kwargs.get('profile', 6902746)
        cyc = kwargs.get('cyc', 1)
        data = fetcher.profile(profile, cyc).to_xarray()
        desc = f"Argo profile {profile}, cycle {cyc}"
    elif mode == 'float':
        # Example: float=6902746
        data = fetcher.float(kwargs.get('float', 6902746)).to_xarray()
        desc = f"Argo float {kwargs.get('float', 6902746)}"
    elif mode == 'region':
        # Example: box=[-10, 30, 10, 40]
        data = fetcher.region(
            box=kwargs.get('box', [-10, 30, 10, 40])
        ).to_xarray()
        desc = f"Argo region {kwargs.get('box', [-10, 30, 10, 40])}"
    else:
        raise ValueError(f"Unknown mode: {mode}")

    # Convert to DataFrame for storage
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


all_tools = [load_argo_data, run_duckdb, display]


if __name__ == "__main__":
    pass