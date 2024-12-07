// src/stores.js
import { writable } from 'svelte/store';

// Create a writable store to hold a global variable
export const backendIp = writable('Hello, World!');
