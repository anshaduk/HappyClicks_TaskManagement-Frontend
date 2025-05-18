import TaskForm from '../components/tasks/TaskForm';

const NewTaskPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <TaskForm />
    </div>
  );
};

export default NewTaskPage;