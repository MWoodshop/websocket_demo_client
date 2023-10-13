import React, { useState, useEffect, useRef } from 'react'; // <-- Don't forget to import useRef
import { createConsumer } from '@rails/actioncable';
import logo from './logo.svg';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);

  // Log the variables AFTER they're declared
  console.log("Rendering App component");
  console.log("Message:", message);
  console.log("Received Messages:", receivedMessages);

  // Using useRef to hold the mutable value of the chatSubscription
  const chatSubscription = useRef(null);

  useEffect(() => {
    const cable = createConsumer('ws://localhost:3000/cable');

    chatSubscription.current = cable.subscriptions.create('ChatChannel', {
      received: (data) => {
        setReceivedMessages((prev) => [...prev, data.message]);
      }
    });
  }, []);

  const sendMessage = () => {
    chatSubscription.current.send({ message });
    setMessage('');
};

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          WebSocket Demo with Rails and React
        </p>
      </header>
      <div className="App-content">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
        <ul>
          {receivedMessages.map((msg, idx) => (
            <li key={idx}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
