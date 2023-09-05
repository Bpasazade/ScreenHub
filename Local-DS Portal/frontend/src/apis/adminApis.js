import axios from 'axios';

export async function registerUser(name, 
                                   lastname,  
                                   mainUserDegree, 
                                   email, 
                                   phoneNumber, 
                                   backupName, 
                                   backupLastname, 
                                   backUserDegree, 
                                   backupPhoneNumber, 
                                   companyName, 
                                   companyAddress, 
                                   numberOfScreens, 
                                   password,
                                   roles) {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/signup', { name, 
                                                                                     lastname,  
                                                                                     mainUserDegree, 
                                                                                     email, 
                                                                                     phoneNumber, 
                                                                                     backupName, 
                                                                                     backupLastname, 
                                                                                     backUserDegree, 
                                                                                     backupPhoneNumber, 
                                                                                     companyName, 
                                                                                     companyAddress, 
                                                                                     numberOfScreens, 
                                                                                     password,
                                                                                     roles});

        if (response.status !== 200) {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchUsers() {
  try {
    const response = await axios.get('http://localhost:3000/api/users');
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function deleteUser(_id) {
  try {
    const response = await axios.delete(`http://localhost:3000/api/users/${_id}`);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function updateUser(_id, editedUser) {
  try {
    const response = await axios.put(`http://localhost:3000/api/users/${_id}`, editedUser);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
}