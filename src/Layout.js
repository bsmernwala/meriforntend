// components/Layout.js
import React from "react";
import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <div>
      <header style={{ backgroundColor: "#f4f4f4", padding: "10px" }}>
        <h1>🛒 My e-Commerce Portal</h1>
        <nav>
          <Link to="/adminmain">Admin</Link> |{" "}
          <Link to="/customermain">Customer</Link> |{" "}
          <Link to="/vendermain">Vendor</Link>
        </nav>
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>

      <footer style={{ backgroundColor: "#eee", padding: "10px", marginTop: "20px" }}>
        <p>&copy; 2025 E-Commerce System</p>
      </footer>
    </div>
  );
}

export default Layout;
