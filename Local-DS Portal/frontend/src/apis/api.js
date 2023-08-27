import axios from 'axios';

export async function signIn(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/signin', { email, password });

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUsers() {
    const response = await fetch('/api/test/all');
    const data = response.json();
}