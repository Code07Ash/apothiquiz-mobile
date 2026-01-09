import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEYS = {
  USERS: 'registered_users',
  CURRENT_USER: 'current_user'
};

export async function registerUser(userData) {
  try {
    const users = await getUsers();
    
    if (users.find(user => user.username === userData.username)) {
      throw new Error('User already exists');
    }

    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      dateOfBirth: userData.dateOfBirth,
      username: userData.username,
      password: userData.password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await AsyncStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    
    return { success: true, user: newUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function loginUser(username, password) {
  try {
    const users = await getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    await AsyncStorage.setItem(AUTH_KEYS.CURRENT_USER, JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function logoutUser() {
  try {
    await AsyncStorage.removeItem(AUTH_KEYS.CURRENT_USER);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUser() {
  try {
    const user = await AsyncStorage.getItem(AUTH_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

async function getUsers() {
  try {
    const users = await AsyncStorage.getItem(AUTH_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    return [];
  }
}