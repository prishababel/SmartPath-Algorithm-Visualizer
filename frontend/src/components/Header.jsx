import React from 'react';
/*
 Header.jsx
 - Top bar with tabs to switch between Sorting and Pathfinding.
 - Uses Tailwind to create a cute, aesthetic header.
*/

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="bg-gradient-to-r from-brand-100 to-brand-300 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/80 flex items-center justify-center text-brand-700 font-bold text-xl">SP</div>
          <div>
            <h1 className="text-2xl font-semibold text-white">SmartPath</h1>
            <p className="text-sm text-white/80">Full-stack algorithm visualizer — sorting, pathfinding & ML</p>
          </div>
        </div>
        <nav className="flex gap-2 items-center">
          <button
            onClick={() => setActiveTab('pathfinding')}
            className={`px-3 py-1 rounded-lg text-white ${activeTab === 'pathfinding' ? 'bg-white/20' : 'bg-white/10'}`}
          >
            Pathfinding
          </button>
          <button
            onClick={() => setActiveTab('sorting')}
            className={`px-3 py-1 rounded-lg text-white ${activeTab === 'sorting' ? 'bg-white/20' : 'bg-white/10'}`}
          >
            Sorting
          </button>
        </nav>
      </div>
    </header>
  );
}
