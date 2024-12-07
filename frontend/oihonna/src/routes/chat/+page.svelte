<script>
    import MainLayout from '../MainLayout.svelte';  // Import the MainLayout component
    import { backendIp } from '../../stores';
    import { onMount } from 'svelte';
    let messages = [];
    let message = '';
    let username = 'User1'; // Hardcoded username for now, can be dynamically set later
  
    // Fetch existing messages on page load
    onMount(async () => {
        getMessages();
    });

    const getMessages = async () => {
        const res = await fetch('http://localhost:3000/api/chat');
        if (res.ok) {
        messages = await res.json();
        } else {
        console.error('Failed to fetch messages');
        }       
    }
  
    // Function to send a message
    const sendMessage = async () => {
      if (!message) return;
  
      const res = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message }),
      });
  
      if (res.ok) {
        const newMessage = await res.json();
        messages.push({
          username,
          message,
          timestamp: new Date().toISOString(),
        });
        message = '';  // Clear input after sending
      } else {
        console.error('Failed to send message');
      }
      getMessages();
    };
  </script>
  
  <!-- Use MainLayout to wrap the chat content -->
  <MainLayout>
    <slot>
        <div class="chat-container">
            <div class="messages">
              {#each messages as { username, message, timestamp }}
                <div class="message">
                  <span>{username}:</span> {message} <br>
                  <small>{new Date(timestamp).toLocaleString()}</small>
                </div>
              {/each}
            </div>
        
            <input
              type="text"
              bind:value={message}
              placeholder="Type your message here..."
            />
            <button on:click={sendMessage}>Send</button>
          </div>
    </slot>
  </MainLayout>
  
  <style>
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 400px;
      width: 100%;
      max-width: 600px;
      margin: auto;
      border: 1px solid #ccc;
      padding: 10px;
      background-color: #f9f9f9;
    }
  
    .messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 10px;
    }
  
    .message {
      padding: 5px;
      margin-bottom: 10px;
      border-radius: 5px;
      background-color: #e0e0e0;
    }
  
    .message span {
      font-weight: bold;
    }
  
    input[type="text"] {
      width: 80%;
      padding: 10px;
      font-size: 14px;
    }
  
    button {
      padding: 10px;
      font-size: 14px;
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
    }
  
    button:hover {
      background-color: #45a049;
    }
  </style>
  