// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./auth";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" />;
  }

  return children; // Render children if authenticated
};

export default ProtectedRoute;
