# PostGIS Setup Guide for ARGO Data

## Prerequisites
1. PostgreSQL 12+ installed
2. PostGIS extension available

## Windows PostGIS Installation

### Option 1: Using PostgreSQL installer
1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, make sure to include "PostGIS" in the components
3. PostGIS will be automatically available

### Option 2: Manual PostGIS Installation
1. Download PostGIS bundle from https://postgis.net/windows_downloads/
2. Run the installer and select your PostgreSQL installation
3. PostGIS will be added to your PostgreSQL instance

### Option 3: Using Stack Builder (Recommended)
1. Open "Stack Builder" from PostgreSQL menu
2. Select your PostgreSQL installation
3. Under "Spatial Extensions", select "PostGIS"
4. Follow the installation wizard

## Verify PostGIS Installation
Open PostgreSQL and run:
```sql
SELECT version();
SELECT PostGIS_Version();
```

## Python Dependencies
Install the updated requirements:
```bash
pip install -r requirements.txt
```

This includes:
- psycopg2-binary: PostgreSQL adapter
- sqlalchemy: Database toolkit
- geoalchemy2: PostGIS integration
- pandas: Data manipulation
- numpy: Numerical computing

## Database Features

### Spatial Data
- Geography column using WGS84 (SRID 4326)
- GIST spatial indexing for fast spatial queries
- PostGIS functions for spatial operations

### Optimized Indexing
- Spatial GIST index on location column
- B-tree indexes on frequently queried columns
- Composite indexes for common query patterns

### Example Spatial Queries
```sql
-- Find points within 100km of a location
SELECT * FROM argo_profiles 
WHERE ST_DWithin(location, ST_GeogFromText('POINT(76.343 -31.918)'), 100000);

-- Find points in a bounding box
SELECT * FROM argo_profiles 
WHERE ST_Intersects(location, ST_MakeEnvelope(75, -35, 80, -30, 4326));

-- Calculate distances
SELECT float_id, ST_Distance(location, ST_GeogFromText('POINT(76.343 -31.918)')) as distance_m
FROM argo_profiles 
ORDER BY distance_m LIMIT 10;
```