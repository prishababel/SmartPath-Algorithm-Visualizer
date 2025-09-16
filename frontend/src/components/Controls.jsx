import React from 'react';

/*
 Controls.jsx
 - Small reusable UI for pathfinding controls.
*/

export default function Controls({ children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 bg-white/80 rounded-xl p-3 shadow-inner">
      {children}
    </div>
  );
}
