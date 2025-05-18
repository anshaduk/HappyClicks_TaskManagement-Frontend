import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TaskItem from '../components/tasks/TaskItem';
import taskService from '../services/taskService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  
  const statusFilter = searchParams.get('status') || '';
  const priorityFilter = searchParams.get('priority') || '';
  const searchQuery = searchParams.get('search') || '';
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const filters = {
          status: statusFilter,
          priority: priorityFilter,
          search: searchQuery
        };
        
        const data = await taskService.getAllTasks(filters);
        setTasks(data);
        setError('');
      } catch (err) {
        setError('Failed to fetch tasks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, [statusFilter, priorityFilter, searchQuery]);
  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      const updatedTask = await taskService.updateTask(taskId, {
        ...taskToUpdate,
        status: newStatus
      });
      
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };
  
  const handleDelete = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };
  
  const handleFilterChange = (filterName, value) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (value) {
      newParams.set(filterName, value);
    } else {
      newParams.delete(filterName);
    }
    
    setSearchParams(newParams);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get('search');
    
    const newParams = new URLSearchParams(searchParams);
    
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Link to="/tasks/new" className="btn btn-primary">
          Add New Task
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-wrap items-end gap-4">
        
          <form onSubmit={handleSearch} className="flex-grow min-w-[200px]">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search tasks..."
                defaultValue={searchQuery}
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
          
          
          <div className="w-full sm:w-auto">
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          
          <div className="w-full sm:w-auto">
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
        
          {(statusFilter || priorityFilter || searchQuery) && (
            <button
              onClick={() => {
                setSearchParams({});
              }}
              className="text-sm text-gray-600 hover:text-gray-900 ml-auto py-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          {(statusFilter || priorityFilter || searchQuery) ? (
            <p className="text-gray-600 mb-4">Try changing your filters to see more results.</p>
          ) : (
            <p className="text-gray-600 mb-4">You don't have any tasks yet.</p>
          )}
          <Link to="/tasks/new" className="btn btn-primary">
            Create a task
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="space-y-4 p-4">
            {tasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;