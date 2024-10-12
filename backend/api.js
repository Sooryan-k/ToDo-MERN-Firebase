const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

const CONNECTION_STRING = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5030;

// Mongoose schema for the todo items
const todoSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false, // Track if the todo is completed
  },
  completedAt: {
    type: Date, // Store the timestamp when the todo was completed
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a Mongoose model
const Todo = mongoose.model('Todo', todoSchema);

// Connect to MongoDB
mongoose.connect(CONNECTION_STRING)
  .then(() => console.log("MongoDB connection successful"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Get all todos for a specific user
app.get('/api/todoapp/getnotes/:userId', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching todos" });
  }
});

// Create a new todo for a specific user
app.post('/api/todoapp/addtodo', async (req, res) => {
  const { description, userId } = req.body;
  const newTodo = new Todo({ description, userId });

  try {
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: "Error creating todo" });
  }
});

// Update a todo as completed or uncompleted
app.put('/api/todoapp/updatetodo/:id', async (req, res) => {
  try {
    const { completed } = req.body;
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todo.completed = completed;
    todo.completedAt = completed ? new Date() : null;

    await todo.save();
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ message: "Error updating todo" });
  }
});

// Delete a todo by ID
app.delete('/api/todoapp/deletetodo/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Todo deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
