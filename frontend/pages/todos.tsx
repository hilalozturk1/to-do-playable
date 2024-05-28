import { useState, useEffect } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState<string>("");
  const [editTodoImage, setEditTodoImage] = useState<File | null>(null);
  const [editTodoAttachment, setEditTodoAttachment] = useState<File | null>(null);
  const [tagFilter, setTagFilter] = useState<string>("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const response = await axios.get(`http://localhost:3000/api/todos/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error(error);
      setTodos(null);
    }
  };

  const handleEdit = (todoId: string, title: string) => {
    setEditTodoId(todoId);
    setEditTodoTitle(title);
  };

  const handleSaveImage = async () => {
    try {
      if (!editTodoImage || !editTodoId) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", editTodoImage);
      formData.append("todoId", editTodoId);

      await axios.post(`http://localhost:3000/api/public/image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditTodoImage(null);
      fetchData();
    } catch (error) {
      console.error("Error saving edited image:", error);
    }
  };

  const handleSaveAttachment = async () => {
    try {
      if (!editTodoAttachment || !editTodoId) return;

      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", editTodoAttachment);
      formData.append("todoId", editTodoId);

      await axios.post(`http://localhost:3000/api/public/file`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditTodoAttachment(null);
      fetchData();
    } catch (error) {
      console.error("Error saving edited attachment:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!editTodoTitle) return;

      const token = localStorage.getItem("token");
      const updatedTodo = { title: editTodoTitle };

      await axios.put(`http://localhost:3000/api/todos/${editTodoId}`, updatedTodo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchData();
      setEditTodoId(null);
      setEditTodoTitle("");
      setEditTodoImage(null);
      setEditTodoAttachment(null);
    } catch (error) {
      console.error("Error saving edited todo:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    window.location.href = "/";
  };

  const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(e.target.value);
  };

  return (
    <main className={`${styles.main} ${inter.className}`}>
      <h1>Todo List</h1>
      <input
        type="text"
        value={tagFilter}
        onChange={handleTagFilterChange}
        placeholder="Filter by tag like completed"
      />
      <ul>
        {todos &&
          todos
            .filter((todo) => tagFilter === "" || todo.tag === tagFilter)
            .map((todo: any, index: number) => (
              <li key={index}>
                {todo.tag}
                <br />
                {todo.title}
                <br />
                {editTodoId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editTodoTitle}
                      onChange={(e) => setEditTodoTitle(e.target.value)}
                    />
                    <br />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditTodoImage(e.target.files?.[0] || null)}
                    />
                    <br />
                    <button onClick={handleSaveImage}>Save Image</button>
                    <br />
                    <input
                      type="file"
                      onChange={(e) => setEditTodoAttachment(e.target.files?.[0] || null)}
                    />
                    <br />
                    <button onClick={handleSaveAttachment}>Save Attachment</button>
                    <br />
                    <button onClick={handleSave}>Save Title</button>
                    <button onClick={() => setEditTodoId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {todo.image && (
                      <img
                        src={`http://localhost:3000${todo.image}`}
                        alt="Todo Image"
                        style={{ height: 100, width: 100 }}
                      />
                    )}
                    <br />
                    {todo.attachment && (
                      <a href={`http://localhost:3000${todo.attachment}`} download>
                        Download Attachment
                      </a>
                    )}
                    <br />
                    <button
                      onClick={() => handleEdit(todo._id, todo.title)}
                    >
                      Edit
                    </button>
                  </>
                )}
              </li>
            ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
    </main>
  );
};

export default Todos;
