import { writable } from 'svelte/store';

export const loggedIn = writable(false);

export const setLoggedIn = (value) => {
    loggedIn.set(value);
};

export const getUserData = () => {
  const storedData = localStorage.getItem('user');
  const userData = JSON.parse(storedData);
  return userData;
};

export const getToken = () => {
  const storedData = localStorage.getItem('accessToken');
  return storedData;
};

// Function to check if the user is authenticated
export const checkAuth = async () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    try {
      const res = await fetch('http://localhost:3000/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(res.status === 401){
        await refreshToken();
        checkAuth();
      }
      else if (res.ok) {
        setLoggedIn(true); // Set logged-in state to true
      } else {
        setLoggedIn(false); // Invalid token
        localStorage.removeItem('accessToken'); // Remove token if invalid
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setLoggedIn(false);
    }
  } else {
    setLoggedIn(false); // No token found
  }
};

export const handleLogout = async () => {

  const refreshToken = localStorage.getItem('refreshToken');
  try{
      const res = await fetch(`http://localhost:3000/auth/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
      });
  }catch(err){
      console.log(err);
  }
  
  localStorage.removeItem('accessToken'); // Clear tokens (example logic)
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken')
  loggedIn.set(false); // Log the user out (you can add API calls here)

  //localStorage.removeItem('refreshToken');
  //goto('/'); // Redirect to homepage or login page
};

export const refreshToken = async () => {
  const storedRefreshToken = localStorage.getItem('refreshToken');

  if (!storedRefreshToken){
    setLoggedIn(false);
    return;
  }

  const response = await fetch('http://localhost:3000/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
  });

  const data = await response.json();

  if (response.ok) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
  } else {
      console.error('Failed to refresh token', data.error);
      // Handle refresh failure (e.g., logout the user)
  }
};

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('accessToken');

  const response = await fetch(url, {
      ...options,
      headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
      },
  });

  if (response.status === 401) {
      // Access token expired, try to refresh it
      token = await refreshToken();

      if (token) {
          // Retry the request with the new token
          return fetch(url, {
              ...options,
              headers: {
                  ...options.headers,
                  Authorization: `Bearer ${token}`,
              },
          });
      }
  }

  return response;
};
