import React from "react";
import { Link, Outlet } from "react-router-dom";
//import "./CustomerMain.css";

function CustomerMain() {
  
  return (
    <div className="customermain">
       
      <nav>
        <ul>
          <li><Link to="/customermain/customerlogin">Login</Link></li>
          <li><Link to="/customermain/customerreg">Registration</Link></li>
        </ul>
      </nav>

      <div className="customermain-content">
       
        <Outlet />
      </div>
    </div>
  );
}

export default CustomerMain;
