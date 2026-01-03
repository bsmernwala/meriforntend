
//29/10/25
import React, { useEffect, useState } from "react";
import axios from "axios";
//import "./ProductList.css";

function ProductList(props) {
  const [plist, setPList] = useState([]);
  const [pcatglist, setPCatgList] = useState([]);
  const [vlist, setVList] = useState([]);
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    loadAllProducts();
    loadCategories();
    loadVendors();
  }, []);

  const loadAllProducts = () => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/product/showproduct`)
      .then((res) => setPList(res.data))
      .catch((err) => alert(err));
  };

  const loadCategories = () => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
      .then((res) => setPCatgList(res.data))
      .catch((err) => alert(err));
  };

  const loadVendors = () => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/vender/getvendercount`)
      .then((res) => setVList(res.data))
      .catch((err) => alert(err));
  };

  const handleActiveButton = (pid) => {
    axios
      .put(`${REACT_APP_BASE_API_URL}/product/updateproductstatus/${pid}/Active`)
      .then(() => {
        alert("Product Activated ✅");
        loadAllProducts();
      })
      .catch((err) => alert(err));
  };

  const handleInactiveButton = (pid) => {
    axios
      .put(`${REACT_APP_BASE_API_URL}/product/updateproductstatus/${pid}/Inactive`)
      .then(() => {
        alert("Product Deactivated ❌");
        loadAllProducts();
      })
      .catch((err) => alert(err));
  };

  const handleSearch = (evt) => {
    const catgid = evt.target.value;
    if (catgid > 0) {
      axios
        .get(`${REACT_APP_BASE_API_URL}/product/showproductbycatgid/${catgid}`)
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));
    } else {
      loadAllProducts();
    }
  };

  const handleSearchByVender = (evt) => {
    const vid = evt.target.value;
    if (vid > 0) {
      axios
        .get(`${REACT_APP_BASE_API_URL}/product/showproductbyvender/${vid}`)
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));
    } else {
      loadAllProducts();
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2 style={{ color: "#6a8dff" }}>📦 Product Management</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Search By Category</label>
        <select onChange={handleSearch}>
          <option value="0">All</option>
          {pcatglist.map((pcatgitem) => (
            <option key={pcatgitem.pcatgid} value={pcatgitem.pcatgid}>
              {pcatgitem.pcatgname}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px" }}>Search By Vendor</label>
        <select onChange={handleSearchByVender}>
          <option value="0">All</option>
          {vlist.map((vitem) => (
            <option key={vitem.Vid} value={vitem.Vid}>
              {vitem.VenderName}
            </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Product</th>
            <th>Price</th>
            <th>Offer</th>
            <th>Category</th>
            <th>Image</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {plist.map((item) => {
            const cat = pcatglist.find((c) => c.pcatgid === item.pcatgid);
            return (
              <tr key={item.pid}>
                <td>{item.pid}</td>
                <td>{item.pname}</td>
                <td>₹{item.pprice}</td>
                <td>₹{item.oprice}</td>
                <td>{cat ? cat.pcatgname : "-"}</td>
                <td>
                  <img
                    src={item.ppicname}
                    alt={item.pname}
                    height="80"
                    width="80"
                    style={{ borderRadius: "8px" }}
                  />
                </td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "8px",
                      backgroundColor:
                        item.status === "Active" ? "#22c55e" : "#ff6b6b",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleActiveButton(item.pid)}
                    disabled={item.status === "Active"}
                  >
                    Active
                  </button>
                  <span> </span>
                  <button
                    onClick={() => handleInactiveButton(item.pid)}
                    disabled={item.status === "Inactive"}
                  >
                    Inactive
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;

