# Backend (Flask)

## Install & Run (Windows)
1. Open PowerShell or Command Prompt.
2. `cd SmartPath\backend`
3. `pip install -r requirements.txt`
4. `python app.py`

Endpoints:
- POST `/save-grid`  -> accepts JSON body `{ grid: [...] }`
- GET  `/load-grid`  -> returns saved grid JSON
- POST `/predict`    -> accepts `{ grid, start, end }` and returns `{ path: [...] }` computed by server-side BFS

This is a small helper backend intended for demo and persistence.
