<script>
    import MainLayout from '../MainLayout.svelte'; // Use MainLayout
    import { backendIp } from '../../stores/stores'; // Optional: For global backend config
    import { goto } from '$app/navigation';
    import { writable } from 'svelte/store';
    import { setLoggedIn , loggedIn } from '../../stores/auth';

    let email = '';
    let password = '';
    let errorMessage = '';

  
  
    const login = async () => {
      const res = await fetch(`http://localhost:3000/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('Login successful', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoggedIn(true);
        // Redirect to a protected page (e.g., dashboard or home)
        goto('/home');
      } else {
        errorMessage = 'Invalid email or password. Please try again.';
      }
    };
  </script>
  
  <MainLayout>
    <slot>
      <div class="login-container">
        <h1>Login</h1>
        {#if errorMessage}
          <p class="error">{errorMessage}</p>
        {/if}
  
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" bind:value={email} placeholder="Enter your email" required />
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" bind:value={password} placeholder="Enter your password" required />
        </div>
  
        <button on:click={login}>Login</button>
        <p>
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </slot>
  </MainLayout>
  
  <style>
    .login-container {
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
      background-color: #4CAF50;
      color: white;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
  
    button:hover {
      background-color: #45a049;
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
  