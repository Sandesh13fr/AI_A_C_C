# Local Development

## Services

```powershell
docker compose up -d postgres redis
```

## Backend

```powershell
cd backend
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Smoke test:

```powershell
$env:PYTHONPATH='backend'
pytest -q backend\app\tests
```

The backend imports without Postgres drivers by returning structured local development placeholders. Full database behavior requires Postgres with pgvector and the dependencies in `backend/requirements.txt`.

## Frontend

```powershell
cd frontend
npm install
npm.cmd run dev
```

Checks:

```powershell
npm.cmd run typecheck
npm.cmd run build
```

Use `npm.cmd` on Windows PowerShell if script execution policy blocks `npm.ps1`.
