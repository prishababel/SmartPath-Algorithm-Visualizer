import React from 'react';

/*
 GridCell.jsx
 - Small presentational component representing a single grid cell in the pathfinding grid.
 - Props: row, col, type ('empty','start','end','wall','weight','visited','path'), onClick
*/

export default function GridCell({ cell, onToggle }) {
  const { type } = cell;

  const classByType = {
    empty: 'bg-white',
    start: 'bg-green-400',
    end: 'bg-red-400',
    wall: 'bg-gray-800',
    weight: 'bg-yellow-400',
    visited: 'bg-blue-200',
    path: 'bg-purple-400',
  };

  return (
    <div
      onMouseDown={() => onToggle(cell)}
      onMouseEnter={(e) => { if (e.buttons === 1) onToggle(cell); }}
      className={`grid-cell w-8 h-8 border border-gray-200 ${classByType[type] || classByType.empty}`}
      title={`${cell.row},${cell.col} - ${type}`}
    />
  );
}
