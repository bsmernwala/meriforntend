


import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import "./VenderMain.css";
import SellerHero from "./SellerHero";

function VenderMain() {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, "");

  // Hide SellerHero for login/registration pages
  const hideHero =
    currentPath === "/vendermain/venderlogin" ||
    currentPath === "/vendermain/venderreg";

  return (
    <div className="vendermain">
      {/* ===== HEADER =====
      <header className="vender-header">
        <h2 className="panel-title">⚙️ Vendor Control Panel</h2>
      </header> */}

      {/* ===== STICKY NAV ===== */}
      <nav className="vender-nav">
        <Link to="/vendermain/venderlogin" className="vender-btn">
          🔐 Login
        </Link>
        <Link to="/vendermain/venderreg" className="vender-btn">
          🧾 Registration
        </Link>
      </nav>

      {/* ===== MAIN CONTENT ===== */}
      <main className="vender-content">
        {hideHero ? <Outlet /> : <SellerHero />}
      </main>

      <footer className="footer-marquee">
        <marquee>www.sabkuchmiltahai.com</marquee>
      </footer>
    </div>
  );
}

export default VenderMain;
