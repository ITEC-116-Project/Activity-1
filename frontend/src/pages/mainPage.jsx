import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../style/mainPage.css";
import icon from "../assets/logo.png";
import { FaPenToSquare } from "react-icons/fa6";

const API_URL = "http://localhost:3001/tasks"; // 👈 Your NestJS backend URL

function MainPage() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingDate, setEditingDate] = useState("");

  // ✅ Fetch tasks when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const resActive = await fetch(`${API_URL}/active`);
      const resCompleted = await fetch(`${API_URL}/completed`);
      const active = await resActive.json();
      const completed = await resCompleted.json();
      setTasks(active);
      setCompletedTasks(completed);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // ✅ Add new task
  const addTask = async () => {
    if (newTask.trim() === "" || taskDate.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please enter both a task and a date/time!",
      });
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newTask,
          taskTime: taskDate, // backend expects ISO date string
        }),
      });

      if (!res.ok) throw new Error("Failed to save task");

      Swal.fire({
        icon: "success",
        title: "Task Added!",
        text: "Your new task has been added successfully.",
        showConfirmButton: false,
        timer: 1500,
      });

      setNewTask("");
      setTaskDate("");
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not save task!", "error");
    }
  };

  // ✅ Delete task
  const deleteTask = async (id, fromCompleted = false) => {
    Swal.fire({
      title: "Delete this task?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await fetch(`${API_URL}/${id}`, { method: "DELETE" });
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            showConfirmButton: false,
            timer: 1200,
          });
          fetchTasks();
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Could not delete task", "error");
        }
      }
    });
  };

  // ✅ Mark as completed
  const completeTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/complete`, { method: "PATCH" });
      Swal.fire({
        icon: "success",
        title: "Task Completed!",
        showConfirmButton: false,
        timer: 1200,
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not mark as completed", "error");
    }
  };

  // ✅ Edit task (open fields)
  const editTask = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
    setEditingDate(task.taskTime.slice(0, 16)); // compatible with datetime-local
  };

  // ✅ Save edited task
  const saveTask = async (id) => {
    if (editingText.trim() === "" || editingDate.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill out both fields!",
      });
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: editingText,
          taskTime: editingDate,
        }),
      });

      Swal.fire({
        icon: "success",
        title: "Task Updated!",
        showConfirmButton: false,
        timer: 1200,
      });

      setEditingId(null);
      fetchTasks();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update task", "error");
    }
  };

  return (
    <div className="outer-container">
      <div className="todo-container">
        <div className="main-container">
          <h1 className="main-title">
            <img src={icon} alt="App Icon" className="title-icon" /> To-Do List
          </h1>
          <p className="main-description">
            Add, edit, and complete tasks with your desired date and time.
          </p>

          {/* Input */}
          <div className="input-container">
            <input
              type="text"
              placeholder="Enter a new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <input
              type="datetime-local"
              value={taskDate}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setTaskDate(e.target.value)}
              className="datetime-input"
            />
            <button className="add-btn" onClick={addTask}>
              +
            </button>
          </div>

          {/* Active Tasks */}
          <h2 className="section-title">Active Tasks</h2>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                {editingId === task.id ? (
                  <div className="edit-section">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="edit-input"
                    />
                    <input
                      type="datetime-local"
                      value={editingDate}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setEditingDate(e.target.value)}
                      className="edit-datetime"
                    />
                    <button
                      className="save-btn"
                      onClick={() => saveTask(task.id)}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="task-content">
                      <input
                        type="checkbox"
                        className="task-checkbox"
                        onChange={() => completeTask(task.id)}
                      />
                      <div className="task-info">
                        <span className="task-text">{task.text}</span>
                        <small className="task-scheduled">
                          🕒 Task Time:{" "}
                          {new Date(task.taskTime).toLocaleString("en-US")}
                        </small>
                        <small className="task-date">
                          📅 Added On:{" "}
                          {new Date(task.addedOn).toLocaleString("en-US")}
                        </small>
                      </div>
                    </div>
                    <div className="btn-group">
                      <button
                        className="edit-btn"
                        onClick={() => editTask(task)}
                      >
                        <FaPenToSquare size={16} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        X
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <h2 className="section-title">Completed Tasks</h2>
              <ul className="task-list">
                {completedTasks.map((task) => (
                  <li key={task.id} className="task-item completed">
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked
                        readOnly
                        className="task-checkbox"
                      />
                      <div className="task-info">
                        <span className="task-text completed-text">
                          {task.text}
                        </span>
                        <small className="task-scheduled">
                          🕒 Task Time:{" "}
                          {new Date(task.taskTime).toLocaleString("en-US")}
                        </small>
                        <small className="task-date">
                          📅 Added On:{" "}
                          {new Date(task.addedOn).toLocaleString("en-US")}
                        </small>
                      </div>
                    </div>
                    <div className="btn-group">
                      <button
                        className="delete-btn"
                        onClick={() => deleteTask(task.id, true)}
                      >
                        X
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
