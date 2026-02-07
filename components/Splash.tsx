import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0f172a] text-white">
      <div className="text-center">
        <div className="mb-8">
          <i className="fas fa-eye text-6xl text-indigo-400 mb-4"></i>
          <h1 className="text-4xl font-bold mb-2">Project Drishti</h1>
          <p className="text-xl text-slate-400">Smart Crowd Management</p>
        </div>
        <div className="animate-pulse">
          <p className="text-slate-500">Initializing system...</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;
