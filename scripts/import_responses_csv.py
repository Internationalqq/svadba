#!/usr/bin/env python3
import csv
import os
import sys
from datetime import datetime

import psycopg2


def parse_dt(value: str):
    value = (value or "").strip()
    if not value:
        return None
    # Handles values like "2026-03-30 14:46:52.820563+00"
    try:
        return datetime.fromisoformat(value.replace(" ", "T"))
    except Exception:
        return None


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 scripts/import_responses_csv.py /path/to/responses_rows.csv")
        sys.exit(1)

    csv_path = sys.argv[1]
    if not os.path.isfile(csv_path):
        print(f"CSV file not found: {csv_path}")
        sys.exit(1)

    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("DATABASE_URL is not set in environment")
        sys.exit(1)

    conn = psycopg2.connect(database_url)
    cur = conn.cursor()

    # Ensure schema exists
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS responses (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            companion TEXT,
            attendance TEXT,
            bus_option TEXT,
            drinks TEXT,
            companion_drinks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.commit()

    # Full replace from CSV
    cur.execute("TRUNCATE TABLE responses RESTART IDENTITY")
    conn.commit()

    inserted = 0
    with open(csv_path, "r", encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cur.execute(
                """
                INSERT INTO responses (name, companion, attendance, bus_option, drinks, companion_drinks, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    (row.get("name") or "").strip(),
                    (row.get("companion") or "").strip() or None,
                    (row.get("attendance") or "").strip() or None,
                    (row.get("bus_option") or "").strip() or None,
                    (row.get("drinks") or "").strip() or None,
                    (row.get("companion_drinks") or "").strip() or None,
                    parse_dt(row.get("created_at") or ""),
                ),
            )
            inserted += 1

    conn.commit()
    cur.close()
    conn.close()
    print(f"Imported rows: {inserted}")


if __name__ == "__main__":
    main()

