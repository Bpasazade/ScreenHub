export async function signIn(username, password) {
    const response = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }
  
    return response.json();
}

export async function getUsers() {
    const response = await fetch('/api/test/all');
    const data = response.json();

}