
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate
} from "react-router-dom";

import CustomerMain from "./customerviews/CustomerMain";
import VenderMain from "./venderviews/VenderMain";
import AdminMain from "./adminviews/AdminMain";
import AdminLogin from "./adminviews/AdminLogin";
import AdminReg from "./adminviews/AdminReg";
import mainpic from "./mainpic.png";
import CustomerLogin from "./customerviews/CustomerLogin";
import CustomerReg from "./customerviews/CustomerReg";
import VenderLogin from "./venderviews/VenderLogin";
import VenderReg from "./venderviews/VenderReg";
import AdminHome from "./adminviews/AdminHome";
import CustomerHome from "./customerviews/CustomerHome";
import VenderHome from "./venderviews/VenderHome";
import ManageProduct from "./productviews/Product"


import "./index.css";
import ProductList from "./productviews/ProductList";

function MainPage() {
  return (
    <Router>
      <div className="App">
        {/* <img src={mainpic} height={120} width={800} alt="Main" /> */}
        <nav style={{ backgroundColor: "white", padding: "10px" }}>
          <Link to="/adminmain">Admin</Link> <span> | </span>
          <Link to="/customermain">Customer</Link> <span> | </span>
          <Link to="/vendermain">Vendor</Link>
        </nav>

        <Routes>
          {/* Admin Nested Routes */}
          <Route path="/adminmain" element={<AdminMain />}>
           {/* ✅ Default route */}
           {/* <Route index element={<AdminLogin />} /> */}
             {/* ✅ Redirect to customerlogin */}
          <Route index element={<Navigate to="adminlogin" replace />} />   
            <Route path="adminlogin" element={<AdminLogin />} />
            <Route path="adminlogin/adminhome" element={<AdminHome />} />
            <Route path="adminreg" element={<AdminReg />} />
          </Route>

          {/* Customer Nested Routes */}
          <Route path="/customermain" element={<CustomerMain />}>
          
           {/* ✅ Default route */}
              {/* <Route index element={<CustomerLogin />} /> */}

          {/* ✅ Redirect to customerlogin */}
          <Route index element={<Navigate to="customerlogin" replace />} />              
            <Route path="customerlogin" element={<CustomerLogin />} />
            <Route path="customerreg" element={<CustomerReg />} />
          </Route>
          {/* ✅ Separate route for CustomerHome */}
        <Route path="/customerhome" element={<CustomerHome />} />

          {/* Vendor Nested Routes */}
          <Route path="/vendermain" element={<VenderMain />}>
           {/* ✅ Default route */}
               {/* <Route index element={<VenderLogin />} /> */}

                 {/* ✅ Redirect to  venderlogin */}
          <Route index element={<Navigate to="venderlogin" replace />} />   
            <Route path="venderlogin" element={<VenderLogin />} />
            <Route path="venderreg" element={<VenderReg />} />
              <Route path="manageproducts" element={<ManageProduct />} />
          </Route>

           <Route path="/venderhome" element={<VenderHome />} >
           
           </Route>
           {/* <Route path="/manageproducts" element={<ProductList />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default MainPage;
