import { useState } from 'react';
import { Link } from 'react-router-dom';

const TaskItem = ({ task, onDelete, onStatusChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleStatusChange = async (e) => {
    try {
      setIsUpdating(true);
      const newStatus = e.target.value;
      await onStatusChange(task.id, newStatus);
    } catch (error) {
      console.error('Failed to update status', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(task.id);
    } catch (error) {
      console.error('Failed to delete task', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 border-l-4 hover:shadow-md transition-shadow duration-200"
      style={{ borderLeftColor: task.priority === 'high' ? '#f56565' : task.priority === 'medium' ? '#4299e1' : '#cbd5e0' }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mr-2">{task.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
          
          {task.description && (
            <p className="text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Due:</span> {formatDate(task.due_date)}
            </div>
            
            <div className="text-sm text-gray-500">
              <span className="font-medium">Status:</span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(task.status)}`}>
                {formatStatus(task.status)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex mt-3 md:mt-0 space-x-2">
          <select
            className="input py-1 text-sm"
            value={task.status}
            onChange={handleStatusChange}
            disabled={isUpdating}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          
          <Link to={`/tasks/${task.id}`} className="btn btn-secondary py-1 text-sm">
            Edit
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn-danger py-1 text-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;