import pandas as pd
from typing import Literal
from pydantic import BaseModel, Field
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

# Pydantic AI imports
from pydantic_ai import Agent, RunContext

# Load environment variables for database connection
load_dotenv()

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASS", "password")
DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "argo_data")

DB_PASS_ENCODED = quote_plus(DB_PASS)

DATABASE_URL = f"postgresql+psycopg2://{DB_USER}:{DB_PASS_ENCODED}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Global state to store DataFrames
class DataStore:
    def __init__(self):
        self._dataframes = {}
        self._counter = 0

    def store(self, df: pd.DataFrame) -> str:
        self._counter += 1
        ref = f'Out[{self._counter}]'
        self._dataframes[ref] = df
        return ref

    def get(self, ref: str) -> pd.DataFrame:
        if ref not in self._dataframes:
            raise ValueError(f'Error: {ref} is not a valid variable reference. Check the previous messages and try again.')
        return self._dataframes[ref]

datastore = DataStore()

# Initialize the database engine
try:
    engine = create_engine(
        DATABASE_URL,
        echo=True,
        pool_pre_ping=True,
        pool_recycle=3600
    )
    print("Successfully created database engine.")
except SQLAlchemyError as e:
    print(f"Error creating database engine: {e}")
    engine = None

def run_sql(ctx: RunContext, query: str) -> str:
    """Executes a SQL query on the PostgreSQL database."""

    if engine is None:
        return "Error: Database engine is not initialized. Please check the connection details."
    
    try:
        with engine.connect() as connection:
            result_df = pd.read_sql_query(text(query), connection)
        
        ref = datastore.store(result_df)
        return f'Executed SQL query successfully. The result is stored as `{ref}`.'

    except SQLAlchemyError as e:
        return f'Error executing SQL query: {e}'

def display(ctx: RunContext, name: str, name_ref: str) -> str:
    """Displays the first 5 rows of a stored DataFrame."""
    try:
        df = datastore.get(name_ref)
        return df.head().to_string()
    except ValueError as e:
        return str(e)

analyst_agent = Agent(
    model="gpt-4o",
    instructions="You are a data analyst. Your job is to analyze data from a PostgreSQL database according to the user's request. You have access to a SQL tool and a display tool.",
    tools=[run_sql, display]
)