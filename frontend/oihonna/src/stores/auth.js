import { writable } from 'svelte/store';

export const loggedIn = writable(false);

export const setLoggedIn = (value) => {
    loggedIn.set(value);
};

export const getUserData = () => {
  const storedData = localStorage.getItem('user');
  const userData = JSON.parse(storedData);
  return userData;
}
// Function to check if the user is authenticated
export const checkAuth = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const res = await fetch('http://localhost:3000/auth/verify', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setLoggedIn(true); // Set logged-in state to true
      } else {
        setLoggedIn(false); // Invalid token
        localStorage.removeItem('token'); // Remove token if invalid
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setLoggedIn(false);
    }
  } else {
    setLoggedIn(false); // No token found
  }
};
