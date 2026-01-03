// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const isAuth = localStorage.getItem(role + "Auth");
  return isAuth === "true" ? children : <Navigate to={`/${role}main/${role}login`} />;
}

export default ProtectedRoute;


