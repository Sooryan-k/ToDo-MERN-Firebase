import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Paper } from '@mui/material';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useTheme } from '../ThemeContext';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { toggleTheme, isDarkMode } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message on new submit
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setUser(userCredential.user);
      }
    } catch (error) {
      setErrorMessage(error.message); // Display default Firebase error message
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 20px',
        backgroundColor: isDarkMode ? '#303030' : '#f5f5f5',
      }}
    >
      <Paper elevation={6} sx={{ padding: '30px', maxWidth: '400px', width: '100%', backgroundColor: isDarkMode ? '#424242' : '#fff' }}>
        <Typography variant="h5" sx={{ textAlign: 'center', marginBottom: 2, color: isDarkMode ? '#fff' : '#000' }}>
          {isLogin ? 'Login' : 'Signup'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                bgcolor: isDarkMode ? '#424242' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000', 
                },
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    color: isDarkMode ? '#fff' : '#000', 
                  },
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                bgcolor: isDarkMode ? '#424242' : '#fff',
                color: isDarkMode ? '#fff' : '#000',
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? '#fff' : '#000', 
                },
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    color: isDarkMode ? '#fff' : '#000', 
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                bgcolor: isDarkMode ? '#4CAF50' : '#3F51B5', // Green in dark mode, blue in light mode
                color: '#fff',
              }}
            >
              {isLogin ? 'Login' : 'Create Account'}
            </Button>
            <Button onClick={() => setIsLogin(!isLogin)} sx={{ color: isDarkMode ? '#1976D2' : '#3F51B5' }}>
              {isLogin ? 'Create an account' : 'Already have an account?'}
            </Button>
          </Box>
          {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
        </form>
      </Paper>
      <IconButton onClick={toggleTheme} sx={{ position: 'absolute', top: 16, right: 16, color: isDarkMode ? '#fff' : '#000' }}>
        {isDarkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Box>
  );
};

export default Auth;
