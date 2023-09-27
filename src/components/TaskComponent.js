import React, { useState, useContext } from "react";
/* src/index.css (o src/index.scss) */
import 'bootstrap/dist/css/bootstrap.min.css';

// Contexto para gestionar el estado global de las tareas
const TaskContext = React.createContext();

function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Funciones para agregar, editar, eliminar y marcar como completadas las tareas
  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const editTask = (taskId, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        editTask,
        deleteTask,
        toggleComplete,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

function TaskList() {
  const { tasks, toggleComplete, deleteTask, editTask } = useContext(TaskContext);
  const [editableTaskId, setEditableTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  const handleEditClick = (taskId, text) => {
    setEditableTaskId(taskId);
    setEditedTaskText(text); // Inicializar el campo de edición con el texto actual
  };

  const handleSaveClick = (taskId) => {
    editTask(taskId, { text: editedTaskText });
    setEditableTaskId(null);
  };

  return (
    <div className="d-flex justify-content-center py-5 text-white w-100 bg-dark">
      <ul>
        {tasks.map((task) => (
          <li className="my-4" key={task.id}>
            {editableTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                  className="text-dark bg-light"
                />
                <button className="btn btn-success mx-2" onClick={() => handleSaveClick(task.id)}>Guardar</button>
              </>
            ) : (
              <>
               
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    className="me-4"
                  />
                 
                {task.text}
                <button className="btn btn-secondary mx-2" onClick={() => handleEditClick(task.id, task.text)}>Editar</button>
                <button className="btn btn-danger mx-2" onClick={() => deleteTask(task.id)}>Eliminar</button>
              
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


function TaskForm() {
  const [newTask, setNewTask] = useState("");
  const { addTask } = useContext(TaskContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim() !== "") {
      addTask({ id: Date.now(), text: newTask, completed: false });
      setNewTask("");
    }
  };

  return (
  <div className="py-5">
      <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nueva tarea"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        className="text-dark bg-light"
      />
      <button type="submit" className="btn btn-primary mx-3">Agregar</button>
    </form>
  </div>
  );
}

function TaskComponent() {
  return (
    <div className="bg-dark pt-5">
      <h1 className="text-white">Lista de Tareas</h1>
      <TaskProvider >
      <TaskForm />
    
        <TaskList />
      
      </TaskProvider>
    </div>
  );
}

export default TaskComponent;
