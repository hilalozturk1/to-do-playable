// models/todo.js
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
  tag: String,
  image: String,
  attachment: String,
  user: { type: Number, ref: 'User' }
}, { versionKey: false });

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
