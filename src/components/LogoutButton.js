import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(role + "Auth");
    navigate(`/${role}main/${role}login`);
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
