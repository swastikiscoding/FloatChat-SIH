from pydantic_ai import Tool, RunContext, ModelRetry

#, WebSearchTool, CodeExecutionTool
#from pydantic_ai.common_tools.tavily import tavily_search_tool
# https://ai.pydantic.dev/third-party-tools/

from app.schemas.chat import AgentDependencies
from argopy import DataFetcher as ArgopyDataFetcher
import duckdb

from loguru import logger
import pandas as pd

import matplotlib.pyplot as plt
import io
import base64


website_down_msg = """The `erddap` website, the site from where you get your data, may be down.
Ask the user to check at `https://erddap.ifremer.fr/erddap` themselves.
If this is the second time you are getting this error, don't call this tool again."""


def load_argo_profile(
    ctx: RunContext[AgentDependencies],
    float_id: int,
    cyc: int | list[int],
    dataset: str = 'phy',
) -> str:
    """Load Argo data for a specific profile.
    Args:
        float_id: the WMO identifier of the float
        cyc: the cycle number or list of cycle numbers
        dataset: the type of data to load, either 'phy' (physical) or 'bcg' (biogeochemical)
    
    For instance, to retrieve temperature (physical property) data for the 12th profile of float WMO 6902755:
    float_id=6902755, cyc=12, dataset='phy'

    For more than one profile:
    float_id=6902755, cyc=[3, 12], dataset='phy'
    """
    logger.info(f"Loading Argo profile data: float={float_id}, cyc={cyc}")

    try:
        fetcher = ArgopyDataFetcher(
            mode='standard',
            src='erddap',
            ds=dataset # 'phy' or 'bcg'
        )
        data = fetcher.profile(float_id, cyc).to_xarray()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo profile data: {e}")
        raise ModelRetry(f"Error loading Argo profile data: {e}")
    
    desc = f"Argo profile {float_id}, cycle{'s' if isinstance(cyc, list) else ''} {cyc}"
    df: pd.DataFrame = data.to_dataframe().reset_index()
    ref: str = ctx.deps.store(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data: {desc}, rows={len(df)}")
    return '\n'.join(output)


def load_argo_float(
    ctx: RunContext[AgentDependencies],
    float_id: int | list[int],
    dataset: str = 'phy',
) -> str:
    """Load Argo data for a specific float.
    Args:
        float_id: the WMO identifier(s) of the float. Use a list to load multiple floats.
        dataset: the type of data to load, either 'phy' (physical) or 'bcg' (biogeochemical)
    
    Eg. float_id=[6902746, 6902755] (for multiple floats)
    Eg. float_id=6902746 (for a single float)
    """
    logger.info(f"Loading Argo float data: float={float_id}")

    try:
        fetcher = ArgopyDataFetcher(
            mode='standard',
            src='erddap',
            ds=dataset # 'phy' or 'bcg'
        )
        data = fetcher.float(float_id).to_xarray()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo float data: {e}")
        raise ModelRetry(f"Error loading Argo float data: {e}")
    
    desc = f"Argo float {float_id}"
    df = data.to_dataframe().reset_index()
    ref = ctx.deps.store(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
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
    date: list[str] | None = None,
    dataset: str = 'phy',
) -> str:
    """Load Argo data for a specific region.
    The region is defined by:
        lon: list of two floats [lon_min, lon_max]
        lat: list of two floats [lat_min, lat_max]
        dpt: list of two floats [dpt_min, dpt_max]
        date: optional list of two strings [date_min, date_max] in 'YYYY-MM-DD' format
        dataset: the type of data to load, either 'phy' (physical) or 'bcg' (biogeochemical)
    
    If `date` is not specified, the entire time series is fetched.

    Eg: lon=[-60.0, -55.0], lat=[40.0, 45.0], dpt=[0.0, 10.0], date=['2007-08-01', '2007-09-01'], dataset='phy'

    Always think about the size of the data you are requesting!
    If your box is too large, ie. larger than the box above, the data request will likely fail!
    Make sure the distance between lon_min and lon_max is less than 10.0.
    You are allowed to use smaller boxes for approximation.
    """
    box = lon + lat + dpt + (date if date else [])
    logger.info(f"Loading Argo region data: box={box}")
    try:
        fetcher = ArgopyDataFetcher(
            mode='standard',
            src='erddap',
            ds=dataset # 'phy' or 'bcg'
        )
        data = fetcher.region(box).to_xarray()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo region data: {e}")
        raise ModelRetry(f"Error loading Argo region data: {e}")
    
    desc = f"Argo region {box}"
    df = data.to_dataframe().reset_index()
    ref = ctx.deps.store(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data: {desc}, rows={len(df)}")
    return '\n'.join(output)


def run_duckdb(
    ctx: RunContext[AgentDependencies],
    dataframe_ref: str,
    sql: str
) -> str:
    """Run DuckDB SQL query on the DataFrame.
    Note that the virtual table name used in DuckDB SQL must be `dataset`.
    Args:
        dataframe_ref: reference string, which refers to the DataFrame
        sql: the query to be executed using DuckDB
    """
    logger.info(f"Running DuckDB SQL on dataframe={dataframe_ref}, sql={sql}")

    try:
        data = ctx.deps.get(dataframe_ref)
    except Exception as e:
        logger.error(f"Error retrieving dataframe: {e}")
        raise ModelRetry(f"Error retrieving dataframe: {e}")
    
    try:
        result = duckdb.query_df(df=data, virtual_table_name='dataset', sql_query=sql)
    except Exception as e:
        logger.error(f"Error running DuckDB SQL: {e}")
        raise ModelRetry(f"Error running DuckDB SQL: {e}")
    
    # pass the result as ref (because DuckDB SQL can select many rows, creating another huge dataframe)
    ref = ctx.deps.store(result.df())  # pyright: ignore[reportUnknownMemberType]
    output = [
        f'Executed SQL query and stored result inside reference `{ref}`.',
    ]
    logger.info(f"DuckDB query result stored as {ref}, rows={len(result.df())}")  # pyright: ignore[reportUnknownMemberType]
    return '\n'.join(output)


def get_some_rows(
    ctx: RunContext[AgentDependencies],
    dataframe_ref: str
) -> str:
    """Display at most 5 rows of the dataframe stored in dataframe_ref.
    Args:
        dataframe_ref: reference string to the DataFrame
    """
    logger.info(f"Displaying dataframe={dataframe_ref}")

    try:
        df = ctx.deps.get(dataframe_ref)
    except Exception as e:
        logger.error(f"Error retrieving dataframe: {e}")
        raise ModelRetry(f"Error retrieving dataframe: {e}")

    return df.head().to_string()  # pyright: ignore[reportUnknownMemberType]


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
        raise ModelRetry(f"Unsupported plot kind: {kind}. Try again with 'line', 'scatter', or 'bar'.")
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
    plt_str = f"data:image/png;base64,{img_b64}"
    #return f"data:image/png;base64,{img_b64}" LETS NOT BLOW UP AI CREDITS


all_tools = [
    Tool(load_argo_float, sequential=True),
    Tool(load_argo_profile, sequential=True),
    Tool(load_argo_region, sequential=True),
    Tool(run_duckdb, sequential=True),
    Tool(get_some_rows, sequential=True),
    #Tool(plot_saved_data, sequential=True), # don't trust the AI to use this just yet
]


if __name__ == "__main__":
    print(all_tools[0])