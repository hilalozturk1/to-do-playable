import mongoose from 'mongoose';
import User from './models/user';
import Todo from './models/todo';

const connectDB = async () => {
  try {

    await mongoose.connect('mongodb://localhost/todo-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    
    await listUsersAndTodos();

    await recreateUserCollection();

    await listUsersAndTodos();

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};


const recreateUserCollection = async () => {
  try {
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const collection of collections) {
      await mongoose.connection.db.dropCollection(collection.name);
      console.log(`${collection.name} collection dropped`);
    }

    await mongoose.connection.db.createCollection('users');
    await mongoose.connection.db.createCollection('todos');
    console.log('User and Todo collections recreated');

    await insertSampleUsers();
  } catch (error) {
    console.error('Error recreating collections:', error);
  }
};

const insertSampleUsers = async () => {
  try {
    const sampleUsers = [
      { username: 'user1', email: 'user1@example.com', password: 'password1', id:1 },
      { username: 'user2', email: 'user2@example.com', password: 'password2', id:2 },
    ];

    const insertedUsers = await User.insertMany(sampleUsers);

    const sampleTodos = [
      { title: 'ToDo 1 for User 1', description: 'Description for ToDo 1', tag: 'completed', image: './uploads/pictures/bod_mainImg_01.jpg', attachment: './upload/bod_mainImg_01.jpg', user: insertedUsers[0].id },
      { title: 'ToDo 2 for User 1', description: 'Description for ToDo 2', tag: 'ready', image: 'https://www.ricoh-imaging.co.jp/english/products/q-s1/ex/img/bod_mainImg_02.jpg', attachment: 'attachment2.pdf', user: insertedUsers[0].id },
      { title: 'ToDo 1 for User 2', description: 'Description for ToDo 1', tag: 'completed', image: 'image3.jpg', attachment: 'attachment3.pdf', user: insertedUsers[1].id },
    ];

    const insertedTodos = await Todo.insertMany(sampleTodos);

    await Promise.all(
      insertedUsers.map(async (user, index) => {
        user.todos = [insertedTodos[index * 2]._id, insertedTodos[index * 2 + 1]._id];
        await user.save();
      })
    );

    console.log('Sample users and todos inserted');
  } catch (error) {
    console.error('Error inserting sample users and todos:', error);
  }
};

const listUsersAndTodos = async () => {
  try {
    const users = await User.find().populate('todos');
    const todos = await Todo.find();

    console.log('Users:');
    console.log(users);

    console.log('Todos:');
    console.log(todos);
  } catch (error) {
    console.error('Error listing users and todos:', error);
  }
};

export default connectDB;
