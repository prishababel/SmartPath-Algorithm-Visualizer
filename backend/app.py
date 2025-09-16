"""
app.py - simple Flask backend for SmartPath

Endpoints:
- POST /save-grid  -> saves the last posted grid to a JSON file (simple persistence)
- GET  /load-grid  -> loads and returns saved grid JSON
- POST /predict    -> server-side fallback predictor (runs BFS to return path)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from collections import deque

app = Flask(__name__)
CORS(app)

SAVE_PATH = 'saved_grid.json'

@app.route('/save-grid', methods=['POST'])
def save_grid():
    data = request.json
    try:
        with open(SAVE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f)
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/load-grid', methods=['GET'])
def load_grid():
    if not os.path.exists(SAVE_PATH):
        return jsonify({"status": "no-data", "message": "No saved grid found"}), 404
    try:
        with open(SAVE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return jsonify({"status":"ok","grid": data.get('grid', data)}), 200
    except Exception as e:
        return jsonify({"status":"error","message": str(e)}), 500

def bfs_predict(grid, start, end):
    rows = len(grid)
    cols = len(grid[0])
    visited = [[False]*cols for _ in range(rows)]
    parent = [[None]*cols for _ in range(rows)]
    q = deque()
    q.append((start['row'], start['col']))
    visited[start['row']][start['col']] = True
    dirs = [(1,0),(-1,0),(0,1),(0,-1)]
    found = False
    while q:
        r,c = q.popleft()
        if r == end['row'] and c == end['col']:
            found = True
            break
        for dr,dc in dirs:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and not visited[nr][nc] and grid[nr][nc].get('type') != 'wall':
                visited[nr][nc] = True
                parent[nr][nc] = (r,c)
                q.append((nr,nc))
    path = []
    if found:
        cur = (end['row'], end['col'])
        while cur:
            path.append({'row': cur[0], 'col': cur[1]})
            cur = parent[cur[0]][cur[1]]
        path.reverse()
    return path

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    grid = data.get('grid')
    start = data.get('start')
    end = data.get('end')
    if grid is None or start is None or end is None:
        return jsonify({"status":"error","message":"grid/start/end required"}), 400
    try:
        path = bfs_predict(grid, start, end)
        return jsonify({"status":"ok", "path": path}), 200
    except Exception as e:
        return jsonify({"status":"error","message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
