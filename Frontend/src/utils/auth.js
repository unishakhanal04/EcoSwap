export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

export const getTokenFromStorage = () => {
  return localStorage.getItem('token');
};

export const clearAuthStorage = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getTokenFromStorage();
  const user = getUserFromStorage();
  return !!(token && user);
};

export const getUserType = () => {
  const user = getUserFromStorage();
  return user?.userType || null;
};

export const getUserData = getUserFromStorage;