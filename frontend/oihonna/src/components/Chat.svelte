<script>
    import { writable } from "svelte/store";
    import { io } from "socket.io-client";
    import { loggedIn, getUserData, fetchWithAuth, getToken, checkAuth } from "../stores/auth";
    import { onMount, afterUpdate } from "svelte";

    const socket = io('http://localhost:3050'); // Connect to the backend WebSocket server

    let messages = writable([]);
    let message = '';
    let username = '';
    let messagesContainer;

    // Fetch user data (mocked or from your auth system)
    var userData;
    var accessToken;

    onMount(() => {
        accessToken = getToken();
        userData = getUserData();
        username = userData.username; 
    });

    afterUpdate(() => {
        scrollToBottom(); // Scrolls to the bottom after every update
    });

    socket.on('connect', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
    });

    // On mount, set up WebSocket listeners
    socket.on('chatMessages', (data) => {
        messages.set(data);
    });

    socket.on('newMessage', (data) => {
        messages.update((msgs) => {
            const updated = [...msgs, data];
            return updated.slice(-20); // Keep only 20 most recent messages
        });
        scrollToBottom(); // Scroll to the bottom when a new message arrives
    });

    const sendMessage = async () => {
        if (!message) return;
        await checkAuth();
        const newMessage = {
            message,
            timestamp: new Date().toISOString(),
            username,  // Use the current user's username
            accessToken,      // Optionally include the token here if not in handshake
        };

        // Emit the message with user info and token
        socket.emit('sendMessage', newMessage);

        // Clear the input field
        message = '';
    };

    const pictureCache = new Map();
    //EI TOIMI
    const fetchAndCachePicture = async (username) => {
        if (pictureCache.has(username)) {
            return pictureCache.get(username);
        }

        const picture = await getpicture(username);
        pictureCache.set(username, picture);
        return picture;
    };
    //EI TOIMI
    const getPicture = async (name) => {
      try {
        const result = await fetch('http://localhost:3000/api/user', {
          headers: {
            username: name,
          },
        });
        if (result.ok) {
          const data = await result.json();
          return data.picture;
        } else {
          console.error('Failed to fetch picture for', name);
          return ''; // Return a default or empty string if the request fails
        }
      } catch (err) {
        console.error('Error fetching picture:', err);
        return '';
      }
    };

    const scrollToBottom = () => {
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    };
</script>

<div class="chat-container">
    <div class="messages" bind:this={messagesContainer}>
        {#each $messages as { username, message, timestamp, picture }}
            <div class="message">
                <img src={picture} height="20" width="20" alt="□" />
                <span>{username}:</span> {message} <br />
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

<style>
    .chat-container {
        display: flex;
        flex-direction: column;
        height: 500px;
        width: 80%;
        max-width: 800px;
        margin: 100px auto 0;
        border: 1px solid #333;
        padding: 20px;
        background-color: #2a2a2a;
        border-radius: 10px;
    }

    .messages {
        flex-grow: 1;
        overflow-y: auto;
        margin-bottom: 15px;
        padding: 10px;
        background-color: #333;
        border-radius: 5px;
    }

    .message {
        padding: 8px;
        margin-bottom: 12px;
        border-radius: 5px;
        background-color: #444;
        color: #f5f5f5;
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
        background-color: #444;
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
