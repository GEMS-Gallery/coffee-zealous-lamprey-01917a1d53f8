import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
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

  useEffect(() => {
    fetchConversationHistory();
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

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        AI Chat Bot
      </Typography>
      <Box className="chat-container">
        <Box className="chat-history" ref={chatHistoryRef}>
          {messages.map((message, index) => (
            <Box
              key={index}
              className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
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
  );
};

export default App;