import { useState, useEffect } from 'react';

const Stats = ({ stats, loading, error }) => {
  
  const completionPercentage = stats.total > 0
    ? Math.round((stats.by_status.completed / stats.total) * 100)
    : 0;

  const renderStatCard = (title, value, color) => (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4 flex flex-col`}>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Task Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {renderStatCard('Total Tasks', stats.total, 'blue')}
        {renderStatCard('Pending', stats.by_status.pending, 'yellow')}
        {renderStatCard('In Progress', stats.by_status.in_progress, 'indigo')}
        {renderStatCard('Completed', stats.by_status.completed, 'green')}
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Task Completion</h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-right mt-1 text-sm text-gray-600">{completionPercentage}% complete</p>
      </div>
    </div>
  );
};

export default Stats;