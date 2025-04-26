import type React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const sendMessage = async () => {
    try {
      const res = await axios.post('http://localhost:3000/chat', {
        message: message,
      });
      setResponse(res.data.response); // Update the response state with the backend's response
    } catch (error) {
      console.error("Error sending message:", error);
      setResponse("Error: Could not send message.");
    }
  };

  return (
    <div>
      <h2>Chat with Bot</h2>
      <input
        type="text"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message"
      />
      <button type="button" onClick={sendMessage}>Send</button>
      <p>{response}</p>
    </div>
  );
};

export default Chat;
