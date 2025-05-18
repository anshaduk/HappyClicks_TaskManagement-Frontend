import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Stats from './Stats';
import TaskItem from '../tasks/TaskItem';
import taskService from '../../services/taskService';

const Dashboard = () => {
  const [recentTasks, setRecentTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    by_status: {
      pending: 0,
      in_progress: 0,
      completed: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      
      const [tasks, statsData] = await Promise.all([
        taskService.getAllTasks(),
        taskService.getTaskStats()
      ]);
      
    
      const sorted = [...tasks].sort(
        (a, b) => new Date(a.due_date) - new Date(b.due_date)
      ).slice(0, 5);
      
      setRecentTasks(sorted);
      setStats(statsData);
      setError('');
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      
      const taskToDelete = recentTasks.find(task => task.id === taskId);
      if (!taskToDelete) return;
      
      const statusToDecrement = taskToDelete.status;
      
      
      setRecentTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      
      setStats(prevStats => {
        return {
          ...prevStats,
          total: Math.max(0, prevStats.total - 1),
          by_status: {
            ...prevStats.by_status,
            [statusToDecrement]: Math.max(0, prevStats.by_status[statusToDecrement] - 1)
          }
        };
      });
      
      
      await taskService.deleteTask(taskId);
      
      
      const statsData = await taskService.getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to delete task:', err);
      
      fetchData();
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = recentTasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const oldStatus = taskToUpdate.status;
      
      
      const updatedTaskLocal = {
        ...taskToUpdate,
        status: newStatus
      };
      
      
      setRecentTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTaskLocal : task)
      );
      
      
      setStats(prevStats => {
        const updatedStats = { 
          ...prevStats,
          by_status: {
            ...prevStats.by_status,
            [oldStatus]: Math.max(0, prevStats.by_status[oldStatus] - 1),
            [newStatus]: (prevStats.by_status[newStatus] || 0) + 1
          }
        };
        return updatedStats;
      });
      
    
      const updatedTask = await taskService.updateTask(taskId, updatedTaskLocal);
      
      
      setRecentTasks(prevTasks => 
        prevTasks.map(task => task.id === taskId ? updatedTask : task)
      );
      
      
      const statsData = await taskService.getTaskStats();
      setStats(statsData);
    } catch (err) {
      console.error('Failed to update task status:', err);
      
      fetchData();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          Add New Task
        </Link>
      </div>
      
      <div className="mb-8">
        <Stats stats={stats} loading={loading} error={error} />
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upcoming Tasks</h2>
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All Tasks
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
            <p className="text-gray-600 mb-4">You don't have any tasks yet.</p>
            <Link to="/tasks/new" className="btn btn-primary">
              Create your first task
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;