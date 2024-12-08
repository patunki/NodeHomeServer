<script>
    import MainLayout from '../MainLayout.svelte'; // Use MainLayout
    import { backendIp } from '../../stores'; // Optional: For global backend config
    import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let username = '';
    let errorMessage = '';
  
    const signup = async () => {
      const res = await fetch(`http://localhost:3000/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('Signup successful', data);
        // Redirect to login after successful signup
        goto('/login');
      } else {
        errorMessage = 'Failed to sign up. Please try again.';
      }
    };
  </script>
  
  <MainLayout>
    <slot>
      <div class="signup-container">
        <h1>Sign Up</h1>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
  
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" id="username" bind:value={username} placeholder="Choose a username" required />
        </div>
  
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={email} placeholder="Enter your email" required />
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" bind:value={password} placeholder="Create a password" required />
        </div>
  
        <button on:click={signup}>Sign Up</button>
        <p>
          Already have an account? <a href="/login">Log in here</a>.
        </p>
      </div>
    </slot>
  </MainLayout>
  
  <style>
    .signup-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 20px;
      background-color: #f4f4f4;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  
    h1 {
      margin-bottom: 20px;
      text-align: center;
    }
  
    .form-group {
      margin-bottom: 15px;
    }
  
    .form-group label {
      display: block;
      font-weight: bold;
      margin-bottom: 5px;
    }
  
    .form-group input {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  
    button {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
  
    button:hover {
      background-color: #0056b3;
    }
  
    .error {
      color: red;
      text-align: center;
      margin-bottom: 15px;
    }
  
    p {
      text-align: center;
    }
  
    a {
      color: #007BFF;
      text-decoration: none;
    }
  
    a:hover {
      text-decoration: underline;
    }
  </style>
  