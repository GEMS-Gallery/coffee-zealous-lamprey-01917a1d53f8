import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Typography, Box, IconButton, useTheme, ThemeProvider, createTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useForm } from 'react-hook-form';
import { backend } from 'declarations/backend';

type Message = {
  role: string;
  content: string;
  timestamp: bigint;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, reset } = useForm();
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#3498db' : '#90caf9',
          },
          secondary: {
            main: mode === 'light' ? '#2ecc71' : '#66bb6a',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#303030',
            paper: mode === 'light' ? '#ffffff' : '#424242',
          },
        },
      }),
    [mode],
  );

  useEffect(() => {
    fetchConversationHistory();
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode as 'light' | 'dark');
    }
  }, []);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchConversationHistory = async () => {
    try {
      const history = await backend.getConversationHistory();
      setMessages(history);
    } catch (error) {
      console.error('Error fetching conversation history:', error);
    }
  };

  const onSubmit = async (data: { message: string }) => {
    if (data.message.trim() === '') return;

    setIsTyping(true);
    try {
      const response = await backend.sendMessage(data.message);
      await fetchConversationHistory();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsTyping(false);
    }
    reset();
  };

  const clearConversation = async () => {
    try {
      await backend.clearConversation();
      setMessages([]);
    } catch (error) {
      console.error('Error clearing conversation:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1" gutterBottom>
            AI Chat Bot
          </Typography>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
        <Box className="chat-container" bgcolor="background.paper">
          <Box className="chat-history" ref={chatHistoryRef}>
            {messages.map((message, index) => (
              <Box
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
                bgcolor={message.role === 'user' ? 'primary.main' : 'secondary.main'}
                color="background.paper"
              >
                <Typography variant="body1">{message.content}</Typography>
              </Box>
            ))}
            {isTyping && (
              <Box className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </Box>
            )}
          </Box>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} className="input-container">
            <TextField
              {...register('message')}
              className="input-field"
              variant="outlined"
              placeholder="Type your message..."
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="send-button"
              endIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Box>
        <Box mt={2} display="flex" justifyContent="center">
          <Button variant="outlined" color="secondary" onClick={clearConversation}>
            Clear Chat
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;