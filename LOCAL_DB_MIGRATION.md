## Migrate from Supabase to local PostgreSQL on VPS

1. Copy repo changes to VPS:

```bash
cd /opt/svadba
git pull
```

2. Install and create local DB/user:

```bash
sudo DB_PASS='your_strong_password_here' bash deploy/setup_local_postgres_vps.sh
```

3. Update `/opt/svadba/admin/.env`:

```env
DATABASE_URL=postgresql://svadba_user:your_strong_password_here@127.0.0.1:5432/svadba_db
```

4. Upload CSV to VPS (from your PC):

```powershell
scp "C:\Users\UserVik\Desktop\code\svadba\responses_rows.csv" root@158.255.4.237:/opt/svadba/
```

5. Import CSV:

```bash
cd /opt/svadba
DATABASE_URL="postgresql://svadba_user:your_strong_password_here@127.0.0.1:5432/svadba_db" \
python3 scripts/import_responses_csv.py /opt/svadba/responses_rows.csv
```

6. Restart backend:

```bash
sudo systemctl restart svadba-admin
sudo systemctl status svadba-admin --no-pager -l
curl -sS -m 5 http://127.0.0.1:8000/admin/api/ping
```

