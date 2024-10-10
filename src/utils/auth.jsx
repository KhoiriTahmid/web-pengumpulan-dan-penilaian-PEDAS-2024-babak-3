// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";

// Create an Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Example function to simulate login
  const login = (userData) => {
    setCurrentUser(userData); // Set the current user data
  };

  // Example function to simulate logout
  const logout = () => {
    setCurrentUser(null); // Clear the current user data
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
