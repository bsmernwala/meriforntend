import React, { useState } from "react";
import "./AdminReg.css";

function AdminReg() {
  const [aname, setAName] = useState("");
  const [aemail, setAEmail] = useState("");
  const [apass, setAPass] = useState("");

  const handleRegister = () => {
    alert(`Admin Registeration not allowed: ${aname}, ${aemail}`);
  };

  return (
    <div className="adminreg-container">
      <div className="adminreg-form">
        <h4>Administrator Registration</h4>
        <input
          type="text"
          placeholder="Admin ID"
          value={aname}
          onChange={(e) => setAName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={aemail}
          onChange={(e) => setAEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={apass}
          onChange={(e) => setAPass(e.target.value)}
        />
        <button className="adminreg-button" onClick={handleRegister}>
          Register
        </button>
      </div>
    </div>
  );
}

export default AdminReg;
