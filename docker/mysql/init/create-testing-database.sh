#!/usr/bin/env bash

# Create database for testing environment and grant permissions.
mysql --user=root --password="$MYSQL_ROOT_PASSWORD" <<-EOSQL
    CREATE DATABASE IF NOT EXISTS campaign_events_tracker_test;
    GRANT ALL PRIVILEGES ON \`campaign_events_tracker_test\`.* TO '$MYSQL_USER'@'%';
    FLUSH PRIVILEGES;
EOSQL
