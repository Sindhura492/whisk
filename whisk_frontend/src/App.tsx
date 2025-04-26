import type React from 'react';
import Chat from './components/Chat';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Whisk Chatbot</h1>
      <Chat />
    </div>
  );
};

export default App;
