//
import React from "react";
import { Link, Outlet,Route } from "react-router-dom";
import "./AdminMain.css";
import AdminDashboard from "./AdminDashboard";



function AdminMain() {
  return (
    <div className="adminmain">
        {/* Navigation */}
        <nav>
        <ul>
          <li><Link to="/adminmain/adminlogin">Login</Link></li>
          <li><Link to="/adminmain/adminreg">Registration</Link></li>
        </ul>
      </nav>

      <div className="adminmain-content">
        <h2 className="panel-title">Admin Panel</h2>
        
        <Outlet />


      </div>
    </div>
  );
}

export default AdminMain;
