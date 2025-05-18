import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import taskService from '../../services/taskService';

const TaskForm = ({ task = null, onSubmit = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      
      const dueDateObj = new Date(task.due_date);
      const formattedDate = dueDateObj.toISOString().split('T')[0];
      const formattedTime = dueDateObj.toTimeString().slice(0, 5);
      
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(formattedDate);
      setDueTime(formattedTime);
      setPriority(task.priority);
      setStatus(task.status);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!title || !dueDate || !dueTime) {
      setError('Title, due date, and time are required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      
      const combinedDueDate = new Date(`${dueDate}T${dueTime}`).toISOString();
      
    
      const taskData = {
        title,
        description,
        due_date: combinedDueDate,
        priority,
        status
      };
      
      let result;
      if (isEditMode) {
        result = await taskService.updateTask(task.id, taskData);
      } else {
        result = await taskService.createTask(taskData);
      }
      
      if (onSubmit) {
        onSubmit(result);
      } else {
        
        navigate('/tasks');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'Failed to save task. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {isEditMode ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            id="title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date *
            </label>
            <input
              type="date"
              id="dueDate"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
              Due Time *
            </label>
            <input
              type="time"
              id="dueTime"
              className="input"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          {isEditMode && (
            <div className="form-group">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Task'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;