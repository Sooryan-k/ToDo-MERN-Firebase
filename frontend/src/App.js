import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import Auth from './components/Auth';
import { Container, IconButton,Typography } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material'; // Import icons
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useTheme } from './ThemeContext'; // Import the theme context

const App = () => {
  const [user, setUser] = useState(null);
  const { toggleTheme, isDarkMode } = useTheme(); // Use the theme context

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '20px' }}>
      {/* Add the toggle button for dark/light mode */}
      <IconButton onClick={toggleTheme} sx={{ position: 'absolute', top: 16, right: 16 }}>
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
      <Typography variant="h4" component="h1" gutterBottom>
        ToDo <i className="fa-solid fa-check"></i>
      </Typography>
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <TodoForm setUser={setUser} />
      )}
    </Container>
  );
};

export default App;
