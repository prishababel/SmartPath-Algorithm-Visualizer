import React, { useState } from 'react';
import Header from './components/Header';
import SortingVisualizer from './components/SortingVisualizer';
import PathfindingVisualizer from './components/PathfindingVisualizer';

/*
  App.jsx
  - Simple layout that hosts the Header, SortingVisualizer, and PathfindingVisualizer.
  - Uses Tailwind for responsive layout and styling.
*/

export default function App() {
  const [activeTab, setActiveTab] = useState('pathfinding'); // 'sorting' or 'pathfinding'

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'sorting' ? <SortingVisualizer /> : <PathfindingVisualizer />}
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-600">SmartPath — pretty visualizer · Demo ML with TensorFlow.js</footer>
    </div>
  );
}
