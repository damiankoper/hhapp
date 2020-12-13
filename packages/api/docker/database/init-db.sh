#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER hhapp;
    ALTER USER hhapp WITH PASSWORD 'p455word';
    CREATE DATABASE hhapp;
    GRANT ALL PRIVILEGES ON DATABASE hhapp TO hhapp;
EOSQL