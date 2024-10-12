import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, TextField, Button, List, ListItem, ListItemText, Typography, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { auth } from '../firebase';
import { useTheme } from '../ThemeContext';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { signOut } from 'firebase/auth';

const TodoForm = () => {
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const { toggleTheme, isDarkMode } = useTheme();

  const fetchTodos = async () => {
    if (auth.currentUser) {
      const response = await axios.get(`http://localhost:5030/api/todoapp/getnotes/${auth.currentUser.uid}`);
      setTodos(response.data);
    }
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:5030/api/todoapp/deletetodo/${id}`);
    fetchTodos();
  };

  const updateTodoCompletion = async (id, completed) => {
    await axios.put(`http://localhost:5030/api/todoapp/updatetodo/${id}`, { completed });
    fetchTodos();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description) {
      await axios.post('http://localhost:5030/api/todoapp/addtodo', {
        description,
        userId: auth.currentUser.uid 
      });
      setDescription('');
      fetchTodos();
    } else {
      setErrorMessage('Please enter a todo.');
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [auth.currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" sx={{ padding: 4, width: '100%', backgroundColor: isDarkMode ? '#212121' : '#f9f9f9', borderRadius: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        sx={{ marginBottom: 3, bgcolor: isDarkMode ? '#D32F2F' : '#D32F2F' }} // Set Logout button color to red
      >
        Logout
      </Button>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
          <TextField
            fullWidth
            label="Enter a todo"
            id="fullWidth"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{ bgcolor: isDarkMode ? '#424242' : '#fff', borderRadius: 1, color: isDarkMode ? '#fff' : '#000' }}
            InputLabelProps={{
              style: { color: isDarkMode ? '#fff' : '#000' },
            }}
            inputProps={{
              style: { color: isDarkMode ? '#fff' : '#000' }, // Make text color white in dark mode
            }}
          />
          <Button type="submit" variant="contained" endIcon={<i className="fa-solid fa-plus"></i>} sx={{ bgcolor: isDarkMode ? '#1976D2' : '#1976D2', color: isDarkMode ? '#fff' : '#fff' }}>
            Add Todo
          </Button>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </Box>
      </form>
      <List sx={{ width: '100%', maxWidth: 500, bgcolor: isDarkMode ? '#424242' : '#fff', borderRadius: 1, mt: 2 }}>
        {todos.map((todo) => (
          <ListItem key={todo._id} divider>
            <Checkbox
              checked={todo.completed}
              onChange={(e) => updateTodoCompletion(todo._id, e.target.checked)}
              sx={{
                '&.Mui-checked': {
                  color: '#4CAF50', // Change checkbox tick color to green
                },
              }}
            />
            <ListItemText
              primary={todo.description}
              secondary={
                <>
                  <Typography variant="body2" color={isDarkMode ? '#B0BEC5' : '#000'}>
                    Created at: {new Date(todo.createdAt).toLocaleString()}
                  </Typography>
                  {todo.completed && (
                    <Typography variant="body2" color={isDarkMode ? '#B0BEC5' : '#000'}>
                      Completed at: {new Date(todo.completedAt).toLocaleString()}
                    </Typography>
                  )}
                </>
              }
            />
            <Button
              sx={{ marginLeft: 2, bgcolor: isDarkMode ? '#D32F2F' : '#D32F2F', color: '#fff' }} // Set Delete button color 
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => deleteTodo(todo._id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
      <IconButton onClick={toggleTheme} sx={{ position: 'absolute', top: 16, right: 16, color: isDarkMode ? '#fff' : '#000' }}>
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
};

export default TodoForm;
