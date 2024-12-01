import React, { useEffect, useState } from "react";
import {
  Task,
  fetchAllTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../../api/taskApi"; // וודא שזה הנתיב הנכון לקובץ ה-API של המשימות
import styles from "./TaskList.module.css";
import NavBar from "../../nav/Navbar";

// interface Task {
//     _id: string;
//     title: string;
//     description?: string;
//     dueDate?: string;
//     status?: string;
//     assignee?: string;
// }

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buttons = [
    { path: "/Home", label: "עמוד הבית" },
    { path: "/shopping-list", label: "רשימת קניות" },
  ];

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks: Task[] = await fetchAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      setError("שגיאה בטעינת רשימת המשימות.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title.trim()) {
      alert("אנא הכנס שם משימה.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const newTask: Task = await addTask(title, description, dueDate, status);
      setTasks([...tasks, newTask]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("");
    } catch (error) {
      setError("שגיאה בהוספת משימה.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTaskId || !title.trim()) {
      alert("אנא מלא את כל השדות.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const updatedTask: Task = await updateTask(
        editingTaskId,
        title,
        description,
        dueDate,
        status
      );

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === editingTaskId ? { ...task, ...updatedTask } : task
        )
      );
      setEditingTaskId(null);
      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("");
    } catch (error) {
      setError("שגיאה בעדכון משימה.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteTask(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      setError("שגיאה במחיקת משימה.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <NavBar buttons={buttons} />
      <h1 className={styles.title}>רשימת משימות</h1>
      {loading && <p className={styles.loading}>טוען...</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.inputGroup}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="שם המשימה"
          className={styles.input}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="תיאור (אופציונלי)"
          className={styles.textarea}
        ></textarea>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          placeholder="תאריך יעד"
          className={styles.input}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={styles.input}
        >
          <option value="" disabled>
            בחר סטטוס
          </option>
          <option value="Open">פתוח</option>
          <option value="In Progress">בתהליך</option>
          <option value="Completed">הושלם</option>
        </select>

        {editingTaskId ? (
          <button
            onClick={handleUpdateTask}
            className={`${styles.button} ${styles.updateButton}`}
          >
            עדכן משימה
          </button>
        ) : (
          <button
            onClick={handleAddTask}
            className={`${styles.button} ${styles.addButton}`}
          >
            הוסף משימה
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task._id} className={styles.listItem}>
            <span className={styles.itemText}>
              {task.title} - {task.description} -{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "אין תאריך"}{" "}
              - {task.status}
            </span>
            <button
              onClick={() => {
                setTitle(task.title);
                setDescription(task.description || "");
                setDueDate(
                  task.dueDate
                    ? new Date(task.dueDate).toISOString().split("T")[0]
                    : ""
                );

                setStatus(task.status || "");
                setEditingTaskId(task._id);
              }}
              className={`${styles.button} ${styles.editButton}`}
            >
              ערוך
            </button>
            <button
              onClick={() => handleDeleteTask(task._id)}
              className={`${styles.button} ${styles.deleteButton}`}
            >
              מחק
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
