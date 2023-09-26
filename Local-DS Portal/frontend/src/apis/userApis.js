import axios from 'axios';

export async function signIn(email, password) {
  try {
    const response = await axios.post('http://localhost:3000/api/auth/signin', { email, password });

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    const { user } = response.data;
    if (user) {
      await axios.post('http://localhost:3000/api/auth/storeUserIdInSession', { userId: user._id });
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function signOut() {
  try {
    const response = await axios.get('http://localhost:3000/api/auth/signout');

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getDashboard(accessToken) {
  try {
    const headers = {
      'x-access-token': accessToken,
    };

    const response = await axios.get('http://localhost:3000/api/test/user', { headers });

    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
}