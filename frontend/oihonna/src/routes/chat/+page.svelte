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
        
            <div class="input-container">
                <input
                  type="text"
                  bind:value={message}
                  placeholder="Type your message here..."
                />
                <button on:click={sendMessage}>Send</button>
              </div>
          </div>
    </slot>
  </MainLayout>
  
  <style>
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 500px; /* Increased the height */
      width: 80%;  /* Wider chat box */
      max-width: 800px; /* Increased max-width */
      margin: 100px auto 0;  /* Move the chat box lower down */
      border: 1px solid #333;  /* Darker border */
      padding: 20px;
      background-color: #2a2a2a; /* Dark background for the whole chat box */
      border-radius: 10px;
    }
  
    .messages {
      flex-grow: 1;
      overflow-y: auto;
      margin-bottom: 15px;
      padding: 10px;
      background-color: #333; /* Darker background for message area */
      border-radius: 5px;
    }
  
    .message {
      padding: 8px;
      margin-bottom: 12px;
      border-radius: 5px;
      background-color: #444; /* Darker message bubble */
      color: #f5f5f5; /* Lighter text color for contrast */
    }
  
    .message span {
      font-weight: bold;
    }
  
    .input-container {
      display: flex;
      gap: 10px;
    }
  
    input[type="text"] {
      width: 75%;
      padding: 12px;
      font-size: 14px;
      background-color: #444; /* Dark background for input */
      color: #f5f5f5;
      border: 1px solid #555;
      border-radius: 5px;
    }
  
    input[type="text"]:focus {
      outline: none;
      border-color: #888;
    }
  
    button {
      padding: 12px;
      font-size: 14px;
      background-color: navy;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 5px;
    }
  
    button:hover {
      background-color: blue;
    }
  </style>
  