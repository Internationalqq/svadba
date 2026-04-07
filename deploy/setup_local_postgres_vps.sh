#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   sudo bash deploy/setup_local_postgres_vps.sh
# Then edit /opt/svadba/admin/.env and set DATABASE_URL to local postgres.

DB_NAME="svadba_db"
DB_USER="svadba_user"
DB_PASS="${DB_PASS:-change_me_strong_password}"

echo "[1/5] Installing PostgreSQL..."
apt update
apt install -y postgresql postgresql-contrib

echo "[2/5] Creating DB user (if missing)..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"

echo "[3/5] Ensuring user password..."
sudo -u postgres psql -c "ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASS}';"

echo "[4/5] Creating DB (if missing)..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 || \
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"

echo "[5/5] Done."
echo ""
echo "Put this in /opt/svadba/admin/.env:"
echo "DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"
echo ""
echo "Then run:"
echo "  sudo systemctl restart svadba-admin"
echo "  cd /opt/svadba && DATABASE_URL=\"postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}\" python3 scripts/import_responses_csv.py /opt/svadba/responses_rows.csv"

