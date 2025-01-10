import jwt_decode from "jwt-decode";

// Check if token exists and is valid
const isLoggedIn = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const decodedToken = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  } catch (error) {
    localStorage.removeItem("token");
    return false;
  }
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Set token in localStorage
const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
const removeToken = () => {
  localStorage.removeItem("token");
};

// Get user data from token
const getUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const decodedToken = jwt_decode(token);
    return decodedToken;
  } catch (error) {
    removeToken();
    return null;
  }
};

// Get authorization header
const getAuthHeader = () => {
  const token = getToken();
  return token ? `Bearer ${token}` : "";
};

// Verify token
const verifyToken = (token) => {
  if (!token) return null;

  try {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

// Handle authentication errors
const handleAuthError = (error) => {
  if (error.message.includes("jwt expired")) {
    removeToken();
    window.location.href = "/login";
    return "Session expired. Please login again.";
  }

  if (error.message.includes("invalid token")) {
    removeToken();
    window.location.href = "/login";
    return "Invalid session. Please login again.";
  }

  return error.message;
};

export {
  isLoggedIn,
  getToken,
  setToken,
  removeToken,
  getUser,
  getAuthHeader,
  verifyToken,
  handleAuthError,
};
