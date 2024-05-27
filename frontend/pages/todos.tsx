import { useState, useEffect } from "react";
import axios from "axios";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
const inter = Inter({ subsets: ["latin"] });

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState<string>("");
  const [editTodoImage, setEditTodoImage] = useState<string>("");
  const [editTodoAttachment, setEditTodoAttachment] = useState<string>("");
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

  const handleEdit = (todoId: string, title: string, image: string, attachment: string) => {
    setEditTodoId(todoId);
    setEditTodoTitle(title);
    setEditTodoImage(image);
    setEditTodoAttachment(attachment);
  };

  const handleSave = async () => {
    try {
      if (!editTodoTitle) return;

      const updatedTodo = {
        title: editTodoTitle,
        image: editTodoImage.name,
        attachment: editTodoAttachment.name,
      };

      await axios.put(`http://localhost:3000/api/todos/${editTodoId}`, updatedTodo);

      fetchData();

      setEditTodoId(null);
      setEditTodoTitle("");
      setEditTodoImage("");
      setEditTodoAttachment("");
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
                <br></br>
                {todo.title}
                <br></br>
                {editTodoId === todo._id ? (
                  <>
                    <input
                      type="text"
                      value={editTodoTitle}
                      onChange={(e) => setEditTodoTitle(e.target.value)}
                    />
                    <br></br>
                    {/* */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditTodoImage(e.target.files?.[0])}
                    />
                    <br></br>
                    <input
                      type="file"
                      onChange={(e) => setEditTodoAttachment(e.target.files?.[0])}
                    />
                    <br></br>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditTodoId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    {/*  */}
                    {todo.image && (
                      <img src={todo.image} alt="Todo Image" style={{ height: 100, width: 100 }} />
                    )}

                    <br></br>
                    {todo.attachment && (
                      <a href={todo.attachment} download>
                        Download Attachment
                      </a>
                    )}
                    <br></br>
                    <button
                      onClick={() => handleEdit(todo._id, todo.title, todo.image, todo.attachment)}
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
