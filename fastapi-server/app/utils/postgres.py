import psycopg2
import pandas as pd
import numpy as np
from pathlib import Path
import os
from typing import List, Optional, Dict
import logging
from datetime import datetime
import glob
from sqlalchemy import create_engine, text
import sys
import getpass
import configparser
from urllib.parse import quote_plus
from geoalchemy2 import Geography

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class ArgoPostgresManager:
    """
    Manages PostgreSQL operations for ARGO oceanographic data.
    Handles CSV file ingestion, database schema creation, and data insertion.
    """
    
    def __init__(self, 
                 host: str = "localhost",
                 port: int = 5432,
                 database: str = "argo_data",
                 username: str = "postgres",
                 password: str = "Swastik@220705"):
        """
        Initialize PostgreSQL connection parameters.
        
        Args:
            host: PostgreSQL server host
            port: PostgreSQL server port
            database: Database name
            username: Database username
            password: Database password
        """
        self.host = host
        self.port = port
        self.database = database
        self.username = username
        self.password = password
        self.connection = None
        self.engine = None
        
        # Database connection string with URL-encoded password to handle special characters
        encoded_password = quote_plus(password)
        self.connection_string = f"postgresql://{username}:{encoded_password}@{host}:{port}/{database}"
        
    def connect(self) -> bool:
        """
        Establish connection to PostgreSQL database.
        
        Returns:
            bool: True if connection successful, False otherwise
        """
        try:
            self.connection = psycopg2.connect(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.username,
                password=self.password
            )
            self.connection.autocommit = True
            
            # Create SQLAlchemy engine for pandas integration
            self.engine = create_engine(self.connection_string)
            
            logger.info(f"✅ Connected to PostgreSQL database: {self.database}")
            return True
            
        except psycopg2.Error as e:
            logger.error(f"❌ Failed to connect to PostgreSQL: {e}")
            return False
    
    def create_database_if_not_exists(self) -> bool:
        """
        Create the database if it doesn't exist.
        
        Returns:
            bool: True if database exists or was created successfully
        """
        try:
            # Connect to default 'postgres' database to create our target database
            temp_conn = psycopg2.connect(
                host=self.host,
                port=self.port,
                database="postgres",
                user=self.username,
                password=self.password
            )
            temp_conn.autocommit = True
            cursor = temp_conn.cursor()
            
            # Check if database exists
            cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{self.database}'")
            exists = cursor.fetchone()
            
            if not exists:
                cursor.execute(f'CREATE DATABASE "{self.database}"')
                logger.info(f"✅ Created database: {self.database}")
            else:
                logger.info(f"📋 Database already exists: {self.database}")
            
            cursor.close()
            temp_conn.close()
            return True
            
        except psycopg2.Error as e:
            logger.error(f"❌ Failed to create database: {e}")
            return False
    
    def create_argo_table(self) -> bool:
        """
        Create the ARGO data table with PostGIS support and schema matching CSV columns.
        
        Returns:
            bool: True if table created successfully
        """
        try:
            cursor = self.connection.cursor()
            
            # Enable PostGIS extension
            cursor.execute("CREATE EXTENSION IF NOT EXISTS postgis")
            logger.info("✅ PostGIS extension enabled")
            
            # Drop table if exists (for fresh start)
            cursor.execute("DROP TABLE IF EXISTS argo_profiles CASCADE")
            
            # Create table with exact CSV column structure + PostGIS geometry
            create_table_sql = """
            CREATE TABLE argo_profiles (
                id SERIAL PRIMARY KEY,
                
                -- Exact columns from CSV files
                profile_id INTEGER,
                float_id VARCHAR(50),
                cycle_number INTEGER,
                latitude DOUBLE PRECISION NOT NULL,
                longitude DOUBLE PRECISION NOT NULL,
                datetime TIMESTAMP,
                pressure DOUBLE PRECISION NOT NULL,
                temperature DOUBLE PRECISION NOT NULL,
                salinity DOUBLE PRECISION NOT NULL,
                pressure_qc VARCHAR(10),
                temperature_qc VARCHAR(10),
                salinity_qc VARCHAR(10),
                project_name TEXT,
                pi_name TEXT,
                platform_type VARCHAR(100),
                data_mode VARCHAR(10),
                data_centre VARCHAR(50),
                
                -- PostGIS geometry column for spatial operations
                location GEOGRAPHY(POINT, 4326),
                
                -- Metadata
                source_file VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                
                -- Constraints
                CONSTRAINT valid_lat CHECK (latitude >= -90 AND latitude <= 90),
                CONSTRAINT valid_lon CHECK (longitude >= -180 AND longitude <= 180),
                CONSTRAINT valid_pressure CHECK (pressure >= -5.0)  -- Allow small negative values due to sensor noise
            )
            """
            
            cursor.execute(create_table_sql)
            
            # Create spatial and regular indexes for performance
            indexes = [
                # Spatial index (GIST) for geography column - most important for spatial queries
                "CREATE INDEX idx_argo_location_gist ON argo_profiles USING GIST(location)",
                
                # Regular indexes for common queries
                "CREATE INDEX idx_argo_lat_lon ON argo_profiles(latitude, longitude)",
                "CREATE INDEX idx_argo_datetime ON argo_profiles(datetime)",
                "CREATE INDEX idx_argo_float_id ON argo_profiles(float_id)",
                "CREATE INDEX idx_argo_pressure ON argo_profiles(pressure)",
                "CREATE INDEX idx_argo_source_file ON argo_profiles(source_file)",
                
                # Composite indexes for common query patterns
                "CREATE INDEX idx_argo_float_cycle ON argo_profiles(float_id, cycle_number)",
                "CREATE INDEX idx_argo_datetime_location ON argo_profiles(datetime, latitude, longitude)",
                "CREATE INDEX idx_argo_pressure_location ON argo_profiles(pressure, latitude, longitude)"
            ]
            
            for index_sql in indexes:
                cursor.execute(index_sql)
                logger.info(f"✅ Created index: {index_sql.split('idx_')[1].split(' ')[0]}")
            
            cursor.close()
            logger.info("✅ Created argo_profiles table with PostGIS support and optimized indexes")
            return True
            
        except psycopg2.Error as e:
            logger.error(f"❌ Failed to create table: {e}")
            return False
    
    def find_csv_files(self, root_dir: str) -> List[str]:
        """
        Recursively find all CSV files in the given directory and sort by date (latest first).
        
        Args:
            root_dir: Root directory to search
            
        Returns:
            List of CSV file paths sorted by date (latest first)
        """
        csv_files = []
        root_path = Path(root_dir)
        
        if not root_path.exists():
            logger.warning(f"Directory does not exist: {root_dir}")
            return csv_files
        
        # Find all .csv files recursively
        for csv_file in root_path.rglob("*.csv"):
            csv_files.append(str(csv_file))
        
        # Sort files by date extracted from filename/path (latest first)
        def extract_date_from_path(file_path):
            """Extract date from file path for sorting"""
            try:
                # Try to extract date from filename (format: YYYYMMDD_prof.csv)
                filename = Path(file_path).stem
                if filename.endswith('_prof'):
                    date_str = filename.replace('_prof', '')
                    # Handle different date formats
                    if len(date_str) == 8:  # YYYYMMDD
                        return datetime.strptime(date_str, '%Y%m%d')
                    elif len(date_str) == 6:  # YYMMDD
                        return datetime.strptime(date_str, '%y%m%d')
                
                # If filename doesn't contain date, try to extract from path
                path_parts = Path(file_path).parts
                for i, part in enumerate(path_parts):
                    if part.isdigit() and len(part) == 4:  # Year
                        year = int(part)
                        if i + 1 < len(path_parts) and path_parts[i + 1].isdigit():
                            month = int(path_parts[i + 1])
                            if i + 2 < len(path_parts):
                                # Try to get day from filename
                                filename = Path(file_path).stem
                                if filename.startswith('2'):  # Starts with date
                                    try:
                                        day = int(filename[6:8])
                                        return datetime(year, month, day)
                                    except:
                                        pass
                            return datetime(year, month, 1)
                
                # Fallback: use file modification time
                return datetime.fromtimestamp(Path(file_path).stat().st_mtime)
                
            except Exception:
                # If all else fails, return a very old date so it's processed last
                return datetime(1900, 1, 1)
        
        # Sort by date (latest first)
        csv_files.sort(key=extract_date_from_path, reverse=True)
        
        logger.info(f"Found {len(csv_files)} CSV files, sorted by date (latest first)")
        if csv_files:
            logger.info(f"   Latest file: {Path(csv_files[0]).name}")
            logger.info(f"   Oldest file: {Path(csv_files[-1]).name}")
        
        return csv_files
    
    def read_and_prepare_csv(self, csv_file_path: str) -> Optional[pd.DataFrame]:
        """
        Read and prepare a CSV file for database insertion with PostGIS geometry.
        
        Args:
            csv_file_path: Path to the CSV file
            
        Returns:
            Prepared DataFrame or None if error
        """
        try:
            # Read CSV file
            df = pd.read_csv(csv_file_path)
            
            if df.empty:
                logger.warning(f"Empty CSV file: {csv_file_path}")
                return None
            
            # Add source file information
            df['source_file'] = str(Path(csv_file_path).relative_to(Path(__file__).parent))
            
            # Handle datetime conversion
            if 'datetime' in df.columns:
                df['datetime'] = pd.to_datetime(df['datetime'], errors='coerce')
            
            # Handle NaN values for numeric columns
            numeric_columns = ['profile_id', 'cycle_number', 'latitude', 'longitude', 
                             'pressure', 'temperature', 'salinity']
            for col in numeric_columns:
                if col in df.columns:
                    df[col] = pd.to_numeric(df[col], errors='coerce')
            
            # Drop rows with invalid essential data
            essential_cols = ['latitude', 'longitude', 'pressure', 'temperature', 'salinity']
            df = df.dropna(subset=essential_cols)
            
            # Additional data quality filters
            initial_count = len(df)
            
            # Filter out extreme negative pressures (likely sensor errors)
            if 'pressure' in df.columns:
                df = df[df['pressure'] >= -5.0]  # Allow small negative values but reject extreme ones
                extreme_pressure_removed = initial_count - len(df)
                if extreme_pressure_removed > 0:
                    logger.info(f"   Filtered out {extreme_pressure_removed} records with extreme negative pressure")
            
            # Filter out invalid temperature and salinity ranges
            if 'temperature' in df.columns:
                temp_before = len(df)
                df = df[(df['temperature'] >= -5.0) & (df['temperature'] <= 50.0)]  # Reasonable ocean temp range
                temp_filtered = temp_before - len(df)
                if temp_filtered > 0:
                    logger.info(f"   Filtered out {temp_filtered} records with invalid temperature")
            
            if 'salinity' in df.columns:
                sal_before = len(df)
                df = df[(df['salinity'] >= 0.0) & (df['salinity'] <= 50.0)]  # Reasonable salinity range
                sal_filtered = sal_before - len(df)
                if sal_filtered > 0:
                    logger.info(f"   Filtered out {sal_filtered} records with invalid salinity")
            
            # Create PostGIS geometry column using raw SQL approach
            # We'll handle this in the insert method since pandas can't directly create PostGIS geometry
            
            # Define expected columns based on actual CSV structure
            expected_columns = [
                'profile_id', 'float_id', 'cycle_number', 'latitude', 'longitude',
                'datetime', 'pressure', 'temperature', 'salinity', 'pressure_qc',
                'temperature_qc', 'salinity_qc', 'project_name', 'pi_name',
                'platform_type', 'data_mode', 'data_centre', 'source_file'
            ]
            
            # Select only the columns that exist in the DataFrame
            available_columns = [col for col in expected_columns if col in df.columns]
            result_df = df[available_columns].copy()
            
            logger.info(f"Prepared {len(result_df)} records from {Path(csv_file_path).name}")
            return result_df
            
        except Exception as e:
            logger.error(f"❌ Error reading CSV {csv_file_path}: {e}")
            return None
    
    def insert_dataframe(self, df: pd.DataFrame, batch_size: int = 1000) -> bool:
        """
        Insert DataFrame into PostgreSQL with PostGIS geometry creation.
        
        Args:
            df: DataFrame to insert
            batch_size: Number of records per batch
            
        Returns:
            bool: True if insertion successful
        """
        try:
            # First, insert the data without the geometry column using pandas
            df_copy = df.copy()
            
            # Insert data using pandas to_sql
            df_copy.to_sql(
                'argo_profiles',
                self.engine,
                if_exists='append',
                index=False,
                method='multi',
                chunksize=batch_size
            )
            
            # Now update the location geometry column using raw SQL
            cursor = self.connection.cursor()
            
            # Update the geometry column for the records we just inserted
            # We identify them by finding records with NULL location that have the source file
            source_file = df['source_file'].iloc[0] if 'source_file' in df.columns else None
            
            if source_file:
                update_geometry_sql = """
                UPDATE argo_profiles 
                SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
                WHERE location IS NULL AND source_file = %s
                """
                cursor.execute(update_geometry_sql, (source_file,))
            else:
                # Fallback: update all NULL geometries
                update_geometry_sql = """
                UPDATE argo_profiles 
                SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
                WHERE location IS NULL
                """
                cursor.execute(update_geometry_sql)
            
            cursor.close()
            
            logger.info(f"✅ Inserted {len(df)} records with PostGIS geometry")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error inserting data: {e}")
            return False
    
    def get_table_stats(self) -> Dict:
        """
        Get statistics about the argo_profiles table including PostGIS spatial info.
        
        Returns:
            Dictionary with table statistics
        """
        try:
            cursor = self.connection.cursor()
            
            # Get total count
            cursor.execute("SELECT COUNT(*) FROM argo_profiles")
            total_count = cursor.fetchone()[0]
            
            # Get unique floats
            cursor.execute("SELECT COUNT(DISTINCT float_id) FROM argo_profiles WHERE float_id IS NOT NULL")
            unique_floats = cursor.fetchone()[0]
            
            # Get date range
            cursor.execute("""
                SELECT MIN(datetime), MAX(datetime) 
                FROM argo_profiles 
                WHERE datetime IS NOT NULL
            """)
            date_range = cursor.fetchone()
            
            # Get geographic bounds using PostGIS functions
            cursor.execute("""
                SELECT 
                    MIN(latitude), MAX(latitude), 
                    MIN(longitude), MAX(longitude),
                    ST_AsText(ST_Extent(location::geometry)) as bbox
                FROM argo_profiles
                WHERE location IS NOT NULL
            """)
            geo_result = cursor.fetchone()
            
            # Count records with geometry
            cursor.execute("SELECT COUNT(*) FROM argo_profiles WHERE location IS NOT NULL")
            geometry_count = cursor.fetchone()[0]
            
            cursor.close()
            
            stats = {
                'total_records': total_count,
                'unique_floats': unique_floats,
                'records_with_geometry': geometry_count,
                'date_range': {
                    'start': date_range[0] if date_range and date_range[0] else None,
                    'end': date_range[1] if date_range and date_range[1] else None
                },
                'geographic_bounds': {
                    'min_lat': geo_result[0] if geo_result else None,
                    'max_lat': geo_result[1] if geo_result else None,
                    'min_lon': geo_result[2] if geo_result else None,
                    'max_lon': geo_result[3] if geo_result else None,
                    'bbox_wkt': geo_result[4] if geo_result and len(geo_result) > 4 else None
                }
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"❌ Error getting table stats: {e}")
            return {}
    
    def process_all_csv_files(self, csv_root_dir: str) -> bool:
        """
        Process all CSV files in chronological order (latest first) and insert into database.
        
        Args:
            csv_root_dir: Root directory containing CSV files
            
        Returns:
            bool: True if processing completed successfully
        """
        # Find all CSV files sorted by date (latest first)
        csv_files = self.find_csv_files(csv_root_dir)
        
        if not csv_files:
            logger.warning(f"No CSV files found in {csv_root_dir}")
            return False
        
        logger.info(f"📅 Processing {len(csv_files)} CSV files in chronological order (latest → oldest)")
        
        processed_count = 0
        failed_count = 0
        total_records = 0
        
        for i, csv_file in enumerate(csv_files, 1):
            # Extract date info for logging
            file_name = Path(csv_file).name
            logger.info(f"\n⏰ [{i}/{len(csv_files)}] Processing: {file_name}")
            
            # Read and prepare CSV
            df = self.read_and_prepare_csv(csv_file)
            
            if df is not None and not df.empty:
                # Insert into database
                if self.insert_dataframe(df):
                    processed_count += 1
                    total_records += len(df)
                    
                    # Log date range from the data if available
                    if 'datetime' in df.columns:
                        valid_dates = df['datetime'].dropna()
                        if not valid_dates.empty:
                            min_date = valid_dates.min()
                            max_date = valid_dates.max()
                            logger.info(f"✅ Successfully processed {file_name} ({len(df)} records) - Date range: {min_date.strftime('%Y-%m-%d')} to {max_date.strftime('%Y-%m-%d')}")
                        else:
                            logger.info(f"✅ Successfully processed {file_name} ({len(df)} records)")
                    else:
                        logger.info(f"✅ Successfully processed {file_name} ({len(df)} records)")
                else:
                    failed_count += 1
                    logger.error(f"❌ Failed to insert data from {file_name}")
            else:
                failed_count += 1
                logger.warning(f"⚠️ No valid data in {file_name}")
        
        # Print summary
        logger.info(f"\n🎉 Processing complete!")
        logger.info(f"✅ Successfully processed: {processed_count} files")
        logger.info(f"❌ Failed to process: {failed_count} files")
        logger.info(f"📊 Total records inserted: {total_records}")
        logger.info(f"📅 Data inserted in chronological order (latest first)")
        
        # Print table statistics
        stats = self.get_table_stats()
        if stats:
            logger.info(f"\n📈 Database Statistics:")
            logger.info(f"   Total records: {stats['total_records']:,}")
            logger.info(f"   Unique floats: {stats['unique_floats']:,}")
            logger.info(f"   Records with PostGIS geometry: {stats['records_with_geometry']:,}")
            if stats['date_range']['start']:
                logger.info(f"   Date range: {stats['date_range']['start']} to {stats['date_range']['end']}")
            
            geo_bounds = stats['geographic_bounds']
            if geo_bounds['min_lat'] is not None:
                logger.info(f"   Geographic bounds: ({geo_bounds['min_lat']:.2f}, {geo_bounds['min_lon']:.2f}) to ({geo_bounds['max_lat']:.2f}, {geo_bounds['max_lon']:.2f})")
                if geo_bounds['bbox_wkt']:
                    logger.info(f"   Spatial extent (WKT): {geo_bounds['bbox_wkt']}")
        
        return processed_count > 0
    
    def close(self):
        """Close database connections."""
        if self.connection:
            self.connection.close()
        if self.engine:
            self.engine.dispose()
        logger.info("🔒 Database connections closed")


def get_database_config():
    """
    Get database configuration with multiple fallback options.
    
    Returns:
        dict: Database configuration
    """
    # First, try to read from config file
    config_file = Path(__file__).parent / "database_config.ini"
    
    if config_file.exists():
        try:
            config = configparser.ConfigParser()
            config.read(config_file)
            
            if 'database' in config:
                db_config = {
                    'host': config.get('database', 'host', fallback='localhost'),
                    'port': config.getint('database', 'port', fallback=5432),
                    'database': config.get('database', 'database', fallback='argo_data'),
                    'username': config.get('database', 'username', fallback='postgres'),
                    'password': config.get('database', 'password', fallback='postgres')
                }
                
                # Check if password is still default placeholder
                if db_config['password'] not in ['your_password_here', 'postgres']:
                    logger.info("📝 Found configuration file, testing connection...")
                    if test_connection(db_config):
                        logger.info("✅ Connected using configuration file!")
                        return db_config
                    else:
                        logger.warning("❌ Configuration file credentials failed")
        except Exception as e:
            logger.warning(f"⚠️ Error reading config file: {e}")
    
    # Try different common configurations
    default_configs = [
        {'username': 'postgres', 'password': 'postgres'},
        {'username': 'postgres', 'password': 'admin'},
        {'username': 'postgres', 'password': 'root'},
        {'username': 'postgres', 'password': '123456'},
        {'username': 'postgres', 'password': 'password'},
        {'username': 'postgres', 'password': ''},  # No password
    ]
    
    base_config = {
        'host': 'localhost',
        'port': 5432,
        'database': 'argo_data'
    }
    
    logger.info("🔐 Testing common PostgreSQL configurations...")
    
    # Try default configurations
    for i, config in enumerate(default_configs, 1):
        test_config = {**base_config, **config}
        logger.info(f"   [{i}/{len(default_configs)}] Trying username: {config['username']}, password: {'(empty)' if not config['password'] else '*' * len(config['password'])}")
        
        if test_connection(test_config):
            logger.info(f"✅ Connected successfully!")
            return test_config
    
    # If none work, ask user for credentials
    logger.warning("❌ All default configurations failed.")
    print("\n" + "="*60)
    print("🔐 PostgreSQL Authentication Required")
    print("="*60)
    print("Please enter your PostgreSQL credentials:")
    print("(Or edit database_config.ini file with your credentials)")
    print("="*60)
    
    while True:
        username = input("Username [postgres]: ").strip() or 'postgres'
        password = getpass.getpass("Password: ").strip()
        
        test_config = {**base_config, 'username': username, 'password': password}
        
        if test_connection(test_config):
            logger.info("✅ Connection successful!")
            
            # Ask if user wants to save credentials
            save = input("\nSave credentials to database_config.ini? (y/n) [n]: ").strip().lower()
            if save == 'y':
                save_config_file(test_config)
            
            return test_config
        else:
            logger.error("❌ Connection failed. Please check your credentials.")
            retry = input("Try again? (y/n) [y]: ").strip().lower()
            if retry == 'n':
                logger.error("Exiting due to connection failure.")
                sys.exit(1)


def save_config_file(config):
    """Save database configuration to file."""
    try:
        config_file = Path(__file__).parent / "database_config.ini"
        
        config_parser = configparser.ConfigParser()
        config_parser['database'] = {
            'host': config['host'],
            'port': str(config['port']),
            'database': config['database'],
            'username': config['username'],
            'password': config['password']
        }
        
        with open(config_file, 'w') as f:
            config_parser.write(f)
        
        logger.info(f"💾 Configuration saved to {config_file}")
        
    except Exception as e:
        logger.warning(f"⚠️ Could not save configuration: {e}")


def test_connection(config):
    """
    Test PostgreSQL connection with given configuration.
    
    Args:
        config: Database configuration dictionary
        
    Returns:
        bool: True if connection successful
    """
    try:
        conn = psycopg2.connect(
            host=config['host'],
            port=config['port'],
            database='postgres',  # Connect to default database first
            user=config['username'],
            password=config['password']
        )
        conn.close()
        return True
    except psycopg2.Error:
        return False


def main():
    """
    Main function to process all ARGO CSV files and load them into PostgreSQL.
    """
    # Get database configuration with authentication handling
    DB_CONFIG = get_database_config()
    
    # CSV files directory
    current_dir = Path(__file__).parent
    csv_root_dir = current_dir / "argo_data"
    
    logger.info("🚀 Starting ARGO data PostgreSQL import process...")
    logger.info(f"📁 CSV files directory: {csv_root_dir}")
    logger.info(f"🗄️  Database: {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}")
    
    # Initialize PostgreSQL manager
    pg_manager = ArgoPostgresManager(**DB_CONFIG)
    
    try:
        # Create database if it doesn't exist
        if not pg_manager.create_database_if_not_exists():
            logger.error("Failed to create/access database")
            return False
        
        # Connect to database
        if not pg_manager.connect():
            logger.error("Failed to connect to database")
            return False
        
        # Create table schema
        if not pg_manager.create_argo_table():
            logger.error("Failed to create table schema")
            return False
        
        # Process all CSV files
        success = pg_manager.process_all_csv_files(str(csv_root_dir))
        
        if success:
            logger.info("🎉 ARGO data import completed successfully!")
        else:
            logger.error("❌ ARGO data import failed")
        
        return success
        
    except Exception as e:
        logger.error(f"❌ Unexpected error: {e}")
        return False
    
    finally:
        pg_manager.close()


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)