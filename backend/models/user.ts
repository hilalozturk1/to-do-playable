import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: Number,
  username: String,
  email: String,
  password: String,
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo' }]
}, { versionKey: false });

const User = mongoose.model('User', userSchema);

export default User;
