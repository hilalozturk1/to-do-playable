import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Container, Row, Col, Form, Button, ListGroup, Image, Modal } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<any[] | null>(null);
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState<string>("");
  const [editTodoImage, setEditTodoImage] = useState<File | null>(null);
  const [editTodoAttachment, setEditTodoAttachment] = useState<File | null>(null);
  const [tagFilter, setTagFilter] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);

  const router = useRouter();

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
    setShowModal(true);
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
      setShowModal(false);
    } catch (error) {
      console.error("Error saving edited todo:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    router.push("/");
  };

  const handleTagFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagFilter(e.target.value);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="text-center">Todo List</h1>
          <Form.Control
            type="text"
            value={tagFilter}
            onChange={handleTagFilterChange}
            placeholder="Filter by tag like completed"
            className="mb-3"
          />
          <ListGroup>
            {todos &&
              todos
                .filter((todo) => tagFilter === "" || todo.tag === tagFilter)
                .map((todo: any, index: number) => (
                  <ListGroup.Item
                    key={index}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{todo.tag}</strong>
                      <br />
                      {todo.title}
                      <br />
                      {todo.image && (
                        <Image
                          src={`http://localhost:3000${todo.image}`}
                          alt="Todo Image"
                          thumbnail
                          style={{ height: 100, width: 100 }}
                        />
                      )}
                      <br />
                      {todo.attachment && (
                        <a href={`http://localhost:3000${todo.attachment}`} download>
                          {todo.attachment.split("/").pop()}
                        </a>
                      )}
                    </div>
                    <Button variant="primary" onClick={() => handleEdit(todo._id, todo.title)}>
                      Edit
                    </Button>
                  </ListGroup.Item>
                ))}
          </ListGroup>
          <Button variant="danger" className="mt-3" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTodoTitle}
                onChange={(e) => setEditTodoTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mt-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditTodoImage(e.target.files?.[0] || null)}
              />
              <Button variant="secondary" className="mt-2" onClick={handleSaveImage}>
                Save Image
              </Button>
            </Form.Group>
            <Form.Group controlId="formAttachment" className="mt-3">
              <Form.Label>Attachment</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setEditTodoAttachment(e.target.files?.[0] || null)}
              />
              <Button variant="secondary" className="mt-2" onClick={handleSaveAttachment}>
                Save Attachment
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Title
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Todos;
