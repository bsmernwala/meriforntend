

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import MySlider from "./MySlider";
import ProductListforMainPage from "./productviews/ProductListforMainPage";
import AdminMain from "./adminviews/AdminMain";
import AdminLogin from "./adminviews/AdminLogin";
import AdminReg from "./adminviews/AdminReg";
import AdminHome from "./adminviews/AdminHome";
import CustomerMain from "./customerviews/CustomerMain";
import CustomerLogin from "./customerviews/CustomerLogin";
import CustomerReg from "./customerviews/CustomerReg";
import CustomerHome from "./customerviews/CustomerHome";
import VenderMain from "./venderviews/VenderMain";
import VenderLogin from "./venderviews/VenderLogin";
import VenderReg from "./venderviews/VenderReg";
import VenderHome from "./venderviews/VenderHome";
import ManageProduct from "./productviews/Product";
import Bill from "./customerviews/Bill";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ThemeToggle from "./components/ThemeToggle";

import "./MainPage.css";
import "./styles/theme.css";
import "./styles/vender-styles.css";

function MainPage() {
  return (
    <Router>
      <div className="mainpage">
        <header className="main-header">
  <nav className="main-nav">
    <div className="nav-links">
      <Link to="/">Home</Link>
      <span> | </span>
      <Link to="/adminmain">Admin</Link>
      <span> | </span>
      <Link to="/customermain">Customer</Link>
      <span> | </span>
      <Link to="/vendermain">Vendor</Link>
    </div>
    <div className="nav-theme-toggle">
      <ThemeToggle />
    </div>
  </nav>
</header>


        <Routes>
          <Route
            path="/"
            element={
              <>
                <MySlider />
                <ProductListforMainPage />
              </>
            }
          />
          <Route path="/adminmain" element={<AdminMain />}>
            <Route index element={<Navigate to="adminlogin" replace />} />
            <Route path="adminlogin" element={<AdminLogin />} />
            <Route path="adminreg" element={<AdminReg />} />
            <Route
              path="adminhome"
              element={
                <AdminProtectedRoute role="admin">
                  <AdminHome />
                </AdminProtectedRoute>
              }
            />
          </Route>
          <Route path="/customermain" element={<CustomerMain />}>
            <Route index element={<Navigate to="customerlogin" replace />} />
            <Route path="customerlogin" element={<CustomerLogin />} />
            <Route path="customerreg" element={<CustomerReg />} />
            <Route
              path="customerhome"
              element={
                <AdminProtectedRoute role="customer">
                  <CustomerHome />
                </AdminProtectedRoute>
              }
            />
          </Route>
          <Route path="/vendermain" element={<VenderMain />}>
            <Route index element={<Navigate to="venderlogin" replace />} />
            <Route path="venderlogin" element={<VenderLogin />} />
            <Route path="venderreg" element={<VenderReg />} />
            <Route
              path="venderhome"
              element={
                <AdminProtectedRoute role="vender">
                  <VenderHome />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="manageproducts"
              element={
                <AdminProtectedRoute role="vender">
                  <ManageProduct />
                </AdminProtectedRoute>
              }
            />
          </Route>
          <Route path="/bill" element={<Bill />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default MainPage;
