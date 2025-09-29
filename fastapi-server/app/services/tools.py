from pydantic_ai import Tool, RunContext, ModelRetry

#, WebSearchTool, CodeExecutionTool
#from pydantic_ai.common_tools.tavily import tavily_search_tool
# https://ai.pydantic.dev/third-party-tools/

from app.schemas.chat import AgentDependencies, Plot_Data
from argopy import DataFetcher as ArgopyDataFetcher
import duckdb
import pandas as pd

from loguru import logger
from pathlib import Path

BASE_DIR = Path(__file__).parent
CACHE_DIR = str(BASE_DIR / 'cache')

sources = [
    'erddap',
    'argovis'
]

website_down_msg = f"""The `erddap` website, the site from where you get your data, may be down.
Ask the user to check at `https://erddap.ifremer.fr/erddap` themselves.
Retry using {[f"`{src}`" for src in sources if src != 'erddap']} as a source instead, if you haven't already!"""

virtual_table_name = 'db'  # used in duckdb SQL queries


def load_argo_profile(
    ctx: RunContext[AgentDependencies],
    float_id: int,
    cyc: int | list[int],
    dataset: str = 'phy',
    source: str = 'erddap',
) -> str:
    """Load Argo data for a specific profile.
    Args:
        float_id: the WMO identifier of the float
        cyc: the cycle number or list of cycle numbers
        dataset: the type of data to load, either 'phy' (physical) or 'bgc' (biogeochemical)
        source: the data source, either 'erddap' or 'argovis' (default is 'erddap')
            ⚠️ You cannot get BGC data from 'argovis', only 'phy' data is available there. For BGC data, use 'erddap'.
    
    For instance, to retrieve temperature (physical property) data for the 12th profile of float WMO 6902755:
    float_id=6902755, cyc=12

    For more than one profile:
    float_id=6902755, cyc=[3, 12]
    """
    logger.info(f"Loading Argo profile data: float={float_id}, cyc={cyc}, dataset={dataset}, source={source}")

    try:
        fetcher = ArgopyDataFetcher(
            mode='standard' if dataset == 'phy' else 'expert',
            src=source, # 'erddap' or 'argovis'
            ds=dataset, # 'phy' or 'bgc'
            #parallel=True,
            progress=True,
            cache=True, cachedir=CACHE_DIR
        )
        df = fetcher.profile(float_id, cyc).to_dataframe().reset_index()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo profile data: {e}")
        raise ModelRetry(f"Error loading Argo profile data: {e}")
    
    desc = f"Argo float ID {float_id}, cycle{'s' if isinstance(cyc, list) else ''} {cyc}, dataset {dataset}"
    ref: str = ctx.deps.store_dataframe(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data with rows={len(df)}.")
    return '\n'.join(output)


def load_argo_float(
    ctx: RunContext[AgentDependencies],
    float_id: int | list[int],
    dataset: str = 'phy',
    source: str = 'erddap',
) -> str:
    """Load Argo data for a specific float.
    Args:
        float_id: the WMO identifier(s) of the float. Use a list to load multiple floats.
        dataset: the type of data to load, either 'phy' (physical) or 'bgc' (biogeochemical)
        source: the data source, either 'erddap' or 'argovis' (default is 'erddap')
            ⚠️ You cannot get BGC data from 'argovis', only 'phy' data is available there. For BGC data, use 'erddap'.

    Eg. float_id=[6902746, 6902755] (for multiple floats)
    Eg. float_id=6902746 (for a single float)
    """
    logger.info(f"Loading Argo float data: float={float_id}, dataset={dataset}, source={source}")

    try:
        fetcher = ArgopyDataFetcher(
            mode='standard' if dataset == 'phy' else 'expert',
            src=source, # 'erddap' or 'argovis'
            ds=dataset, # 'phy' or 'bgc'
            #parallel=True,
            progress=True,
            cache=True, cachedir=CACHE_DIR
        )
        df = fetcher.float(float_id).to_dataframe().reset_index()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo float data: {e}")
        raise ModelRetry(f"Error loading Argo float data: {e}")
    
    desc = f"Argo float {float_id}, dataset {dataset}"
    ref = ctx.deps.store_dataframe(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data with rows={len(df)}.")
    return '\n'.join(output)


def load_argo_region(
    ctx: RunContext[AgentDependencies],
    lon: list[float],
    lat: list[float],
    dpt: list[float],
    date: list[str] | None = None,
    dataset: str = 'phy',
    source: str = 'erddap',
) -> str:
    """Load Argo data for a specific region.
    The region is defined by:
        lon: list of two floats [lon_min, lon_max]
        lat: list of two floats [lat_min, lat_max]
        dpt: list of two floats [dpt_min, dpt_max]
        date: optional list of two strings [date_min, date_max] in 'YYYY-MM-DD' format
        dataset: the type of data to load, either 'phy' (physical) or 'bgc' (biogeochemical)
        source: the data source, either 'erddap' or 'argovis' (default is 'erddap')
            ⚠️ You cannot get BGC data from 'argovis', only 'phy' data is available there. For BGC data, use 'erddap'.
    
    If `date` is not specified, the entire time series is fetched.

    Eg: lon=[-60.0, -55.0], lat=[40.0, 45.0], dpt=[0.0, 10.0], date=['2007-08-01', '2007-09-01'], dataset='phy'

    Always think about the size of the data you are requesting!
    If your box is too large, ie. larger than the box above, the data request will likely fail!
    Make sure the distance between lon_min and lon_max is less than 10.0.
    You are allowed to use smaller boxes for approximation.
    """
    box = lon + lat + dpt + (date if date else [])
    logger.info(f"Loading Argo region data: box={box}, dataset={dataset}, source={source}")
    try:
        fetcher = ArgopyDataFetcher(
            'standard' if dataset == 'phy' else 'expert',
            src=source, # 'erddap' or 'argovis'
            ds=dataset, # 'phy' or 'bgc'
            #parallel=True,
            progress=True,
            cache=True, cachedir=CACHE_DIR
        )
        df = fetcher.region(box).to_dataframe().reset_index()
    except FileNotFoundError as e:
        logger.error(f"Error: {e}\nWebsite may be down.")
        raise ModelRetry(f"Error: {e}\n{website_down_msg}")
    except Exception as e:
        logger.error(f"Error loading Argo region data: {e}")
        raise ModelRetry(f"Error loading Argo region data: {e}")

    desc = f"Argo region {box}, dataset {dataset}"
    ref = ctx.deps.store_dataframe(df)
    output = [
        f'Loaded Argo data inside reference `{ref}`.',
        f'Description: {desc}',
        f'Columns: {list(df.columns)}',
        f'Rows: {len(df)}'
    ]
    logger.info(f"Loaded Argo data with rows={len(df)}.")
    return '\n'.join(output)


def run_duckdb(
    ctx: RunContext[AgentDependencies],
    dataframe_ref: str,
    sql: str
) -> str:
    f"""Run DuckDB SQL query on the DataFrame.
    Args:
        dataframe_ref: reference string, which refers to the DataFrame
        sql: the query to be executed using DuckDB
    
    The DataFrame is made available as a virtual table named `{virtual_table_name}`.
    You can use standard SQL syntax to query the data.
    Example SQL query:
        SELECT AVG(TEMP) FROM {virtual_table_name} WHERE PRES >= 490.0;
    Make sure that the table name `{virtual_table_name}` is used in your SQL query, not `{dataframe_ref}`!

    Note: The result of the query is stored as a new DataFrame reference, not given directly to you.
    """
    logger.info(f"Running DuckDB SQL on dataframe={dataframe_ref}, sql={sql}")

    try:
        data = ctx.deps.get(dataframe_ref)
    except Exception as e:
        logger.error(f"Error retrieving dataframe: {e}")
        raise ModelRetry(f"Error retrieving dataframe: {e}")
    
    try:
        result = duckdb.query_df(df=data, virtual_table_name=virtual_table_name, sql_query=sql)
    except Exception as e:
        if 'Catalog Error: Table' in str(e) and virtual_table_name not in sql:
            if dataframe_ref in sql:
                raise ModelRetry(f"Error: You must use the table name `{virtual_table_name}` in your SQL query, not `{dataframe_ref}`.")
            raise ModelRetry(f"Error: You must use the table name `{virtual_table_name}` in your SQL query, not whatever you used.")
        logger.error(f"Error running DuckDB SQL: {e}")
        raise ModelRetry(f"Error running DuckDB SQL: {e}")
    
    # pass the result as ref (because DuckDB SQL can select many rows, creating another huge dataframe)
    ref = ctx.deps.store_dataframe(result.df())  # pyright: ignore[reportUnknownMemberType]
    output = [
        f'Executed SQL query and stored result inside reference `{ref}`.',
    ]
    logger.info(f"DuckDB query result stored as {ref}, rows={len(result.df())}") # pyright: ignore[reportUnknownMemberType]
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
    plot_title: str,
    kind: str,
    dataframe_ref: str,
    column_for_x: str,
    column_for_y: str,
    x_label: str,
    y_label: str,
) -> None:
    """Plot saved data to show to the user using matplotlib.
    Args:
        plot_title: Title of the plot.
        kind: Type of the plot: 'line', 'bar', or 'scatter'.
        dataframe_ref: Reference string to the DataFrame to plot.
        column_for_x: Column name in the DataFrame to use for the X-axis. Must be a valid column name in the DataFrame. Can contain numeric, datetime, or date string data that will be converted to numeric values.
        column_for_y: Column name in the DataFrame to use for the Y-axis. Must be a valid column name in the DataFrame. Can contain numeric, datetime, or date string data that will be converted to numeric values.
        x_label: Label for the X-axis; will be displayed on the plot.
        y_label: Label for the Y-axis; will be displayed on the plot.
    Returns:
        Nothing. The URL, the contents, nothing about the plot is returned to the LLM. It will all be kept away from you and shown directly to the user.
    """
    logger.info(f"Plotting data from dataframe={dataframe_ref}, x={column_for_x}, y={column_for_y}, kind={kind}, title={plot_title}, x_label={x_label}, y_label={y_label}.")

    try:
        df = ctx.deps.get(dataframe_ref)
        logger.debug(f"Retrieved dataframe with shape {df.shape} and columns: {list(df.columns)}")
        logger.debug(f"X column '{column_for_x}' dtype: {df[column_for_x].dtype}")
        logger.debug(f"Y column '{column_for_y}' dtype: {df[column_for_y].dtype}")
    except Exception as e:
        logger.error(f"Error retrieving dataframe: {e}")
        raise ModelRetry(f"Error retrieving dataframe: {e}")

    try:
        # Get the data and handle different data types
        x_data = df[column_for_x].dropna()
        y_data = df[column_for_y].dropna()
        
        logger.debug(f"Processing X data with dtype: {x_data.dtype}, sample values: {x_data.head().tolist()}")
        logger.debug(f"Processing Y data with dtype: {y_data.dtype}, sample values: {y_data.head().tolist()}")
        
        def convert_data_for_plot(data, column_name):
            """Convert pandas Series to appropriate format for plotting"""
            # First check if it's already numeric
            if pd.api.types.is_numeric_dtype(data):
                return pd.to_numeric(data, errors='coerce').dropna().astype(float).tolist(), "numeric"
            
            # Check if it's datetime
            if pd.api.types.is_datetime64_any_dtype(data):
                # Keep as datetime strings for better frontend display
                clean_data = pd.to_datetime(data).dropna()
                return clean_data.dt.strftime('%Y-%m-%d %H:%M:%S').tolist(), "datetime"
            
            # Handle object dtype (could be strings, dates, etc.)
            if data.dtype == 'object':
                # Try to parse as datetime first
                try:
                    datetime_series = pd.to_datetime(data, errors='raise').dropna()
                    # Return as formatted date strings
                    return datetime_series.dt.strftime('%Y-%m-%d %H:%M:%S').tolist(), "datetime"
                except:
                    # If datetime parsing fails, try numeric conversion
                    try:
                        numeric_series = pd.to_numeric(data, errors='coerce').dropna()
                        return numeric_series.astype(float).tolist(), "numeric"
                    except:
                        raise ModelRetry(f"Cannot convert column '{column_name}' to plot data. Contains non-convertible values.")
            
            # For any other dtype, try force conversion to numeric
            try:
                return pd.to_numeric(data, errors='coerce').dropna().astype(float).tolist(), "numeric"
            except:
                raise ModelRetry(f"Cannot convert column '{column_name}' with dtype {data.dtype} to plot data.")
        
        # Convert both axes to appropriate format
        x_values, x_data_type = convert_data_for_plot(x_data, column_for_x)
        y_values, y_data_type = convert_data_for_plot(y_data, column_for_y)
        
        logger.debug(f"Converted X values (first 5): {x_values[:5] if len(x_values) > 5 else x_values}")
        logger.debug(f"Converted Y values (first 5): {y_values[:5] if len(y_values) > 5 else y_values}")
        
        # Ensure both arrays have the same length after conversion
        min_length = min(len(x_values), len(y_values))
        if min_length == 0:
            raise ModelRetry("No valid numeric data remaining after conversion and cleaning.")
            
        x_values = x_values[:min_length]
        y_values = y_values[:min_length]
        
        # Final validation - ensure all values are appropriate type
        expected_x_types = (int, float) if x_data_type == "numeric" else (str,)
        expected_y_types = (int, float) if y_data_type == "numeric" else (str,)
        
        if not all(isinstance(x, expected_x_types) for x in x_values):
            raise ModelRetry(f"X values contain unexpected data types after conversion: {[type(x).__name__ for x in x_values[:5]]}")
        if not all(isinstance(y, expected_y_types) for y in y_values):
            raise ModelRetry(f"Y values contain unexpected data types after conversion: {[type(y).__name__ for y in y_values[:5]]}")
        
        logger.info(f"Creating plot with {len(x_values)} data points")
        logger.debug(f"X data type: {x_data_type}, sample values: {x_values[:3]}")
        logger.debug(f"Y data type: {y_data_type}, sample values: {y_values[:3]}")
        
        plot_data = Plot_Data(
            title=plot_title,
            kind=kind,
            x_label=x_label,
            y_label=y_label,
            x=x_values,
            y=y_values,
            x_type=x_data_type,
            y_type=y_data_type,
        )
    except Exception as e:
        logger.error(f"Error creating plot data: {e}")
        raise ModelRetry(f"Error creating plot data: {e}")
    
    ctx.deps.store_plot_data(plot_data)


all_tools = [
    Tool(load_argo_float, sequential=True),
    Tool(load_argo_profile, sequential=True),
    Tool(load_argo_region, sequential=True),
    Tool(run_duckdb, sequential=True),
    Tool(get_some_rows, sequential=True),
    Tool(plot_saved_data, sequential=True),
]


if __name__ == "__main__":
    print(all_tools[0])