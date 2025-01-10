import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  // Check both token and isAdmin status
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  console.log("Token:", token); // Debug log
  console.log("Is Admin:", isAdmin); // Debug log

  if (!token || !isAdmin) {
    console.log("Redirecting: Not authorized"); // Debug log
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
