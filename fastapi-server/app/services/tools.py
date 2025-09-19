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

import matplotlib.pyplot as plt
import io
import base64


fetcher = ArgopyDataFetcher(
    mode='standard', # Default, but it's good to be explicit
    src='erddap' # Default, but it's good to be explicit
)


def load_argo_profile(
    ctx: RunContext[AgentDependencies],
    float_id: int,
    cyc: int | list[int]
) -> str:
    """Load Argo data for a specific profile.
    
    For instance, to retrieve data for the 12th profile of float WMO 6902755:
    float_id=6902755, cyc=12

    For more than one profile:
    float_id=6902755, cyc=[3, 12]
    """
    logger.info(f"Loading Argo profile data: float={float_id}, cyc={cyc}")
    data = fetcher.profile(float_id, cyc).to_xarray()
    desc = f"Argo profile {float_id}, cycle{'s' if isinstance(cyc, list) else ''} {cyc}"
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
    float_id: int | list[int]
) -> str:
    """Load Argo data for a specific float.
    float_id: the WMO identifier of the float
    Eg. [6902746, 6902755]
    Eg. 6902746
    """
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
    lon: list[float],
    lat: list[float],
    dpt: list[float],
    date: list[str] | None = None
) -> str:
    """Load Argo data for a specific region.
    The region is defined by:
        lon: list of two floats [lon_min, lon_max]
        lat: list of two floats [lat_min, lat_max]
        dpt: list of two floats [dpt_min, dpt_max]
        date: optional list of two strings [date_min, date_max] in 'YYYY-MM-DD' format
    If `date` is not specified, the entire time series is fetched.

    Eg: lon=[-60.0, -55.0], lat=[40.0, 45.0], dpt=[0.0, 10.0], date=['2007-08-01', '2007-09-01']

    Always think about the size of the data you are requesting!
    If your box is too large, ie. larger than the box above, the data request will likely fail!
    Make sure the distance between lon_min and lon_max is less than 10.0.
    You are allowed to use smaller boxes for approximation.
    """
    box = lon + lat + dpt + (date if date else [])
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


def get_sample_rows(ctx: RunContext[AgentDependencies], name: str) -> str:
    """Display at most 5 rows of the dataframe."""
    logger.info(f"Displaying dataset={name}")
    dataset = ctx.deps.get(name)
    return dataset.head().to_string()  # pyright: ignore[reportUnknownMemberType]


def plot_saved_data(
    ctx: RunContext[AgentDependencies],
    name: str,
    x: str,
    y: str,
    kind: str = "line",
    title: str | None = None
) -> None:
    """Plot saved data to show to the user using matplotlib.
    Args:
        ctx: Pydantic AI agent RunContext
        name: reference string to the DataFrame
        x: column name for x-axis
        y: column name for y-axis
        kind: plot type ('line', 'scatter', 'bar')
        title: optional plot title
    Returns:
        Nothing.
        The Base64-encoded PNG image string is stored in memory to be retrieved later.
    """
    logger.info(f"Plotting data: dataset={name}, x={x}, y={y}, kind={kind}")
    df = ctx.deps.get(name)
    fig, ax = plt.subplots()
    if kind == "line":
        ax.plot(df[x], df[y])
    elif kind == "scatter":
        ax.scatter(df[x], df[y])
    elif kind == "bar":
        ax.bar(df[x], df[y])
    else:
        raise ValueError(f"Unsupported plot kind: {kind}")
    ax.set_xlabel(x)
    ax.set_ylabel(y)
    if title:
        ax.set_title(title)
    buf = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buf, format="png")
    plt.close(fig)
    buf.seek(0)
    img_b64 = base64.b64encode(buf.read()).decode("utf-8")
    logger.info(f"Plotted data for {name} as base64 PNG.")
    #return f"data:image/png;base64,{img_b64}" LETS NOT BLOW UP AI CREDITS


all_tools = [
    load_argo_float,
    load_argo_profile,
    load_argo_region,
    run_duckdb,
    get_sample_rows,
    #plot_saved_data, # don't trust the AI to use this just yet
]


if __name__ == "__main__":
    pass