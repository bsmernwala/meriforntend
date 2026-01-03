// src/productviews/Product.js 3/1/26
import React, { useEffect, useState } from "react";
import axios from "axios";

function Product({ data }) {
  const venderid = data;
  const [pid, setPId] = useState();
  const [pname, setPName] = useState("");
  const [pprice, setPPrice] = useState("");
  const [oprice, setOPrice] = useState("");
  const [ppicname, setPPicName] = useState("");
  const [pcatgid, setPCatgId] = useState("");
  const [pcatglist, setPCatgList] = useState([]);
  const [plist, setPList] = useState([]);
  const [image, setImage] = useState({ preview: "", data: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // 🌀 spinner state
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    getNewPid();
    axios
      .get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
      .then((res) => setPCatgList(res.data))
      .catch((err) => alert(err));
  }, []);

  const fetchProducts = () => {
    if (venderid) {
      axios
        .get(`${REACT_APP_BASE_API_URL}/product/showproductbyvender/${venderid}`)
        .then((res) => setPList(res.data))
        .catch((err) => alert(err));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [venderid]);

  const getNewPid = () => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/product/getmaxpid`)
      .then((res) => setPId(res.data.length + 1))
      .catch((err) => alert(err));
  };

  // 🖼️ Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage({ preview: URL.createObjectURL(file), data: file });
  };

  // 💾 Save / Update Product (with image upload + instant refresh)
  const handleSaveButton = async () => {
    try {
      setLoading(true);
      let uploadedImageUrl = ppicname;

      if (image.data) {
        const formData = new FormData();
        formData.append("file", image.data);
        const uploadRes = await axios.post(
          `${REACT_APP_BASE_API_URL}/product/saveproductimage`,
          formData
        );
        uploadedImageUrl = uploadRes.data.imageUrl;
        setPPicName(uploadedImageUrl);
      }

      const obj = {
        pid,
        pname,
        pprice,
        oprice,
        ppicname: uploadedImageUrl,
        pcatgid,
        vid: venderid,
        status: "Active",
      };

      if (isEditing) {
        setPList((prev) =>
          prev.map((item) => (item.pid === pid ? { ...item, ...obj } : item))
        );
        await axios.put(`${REACT_APP_BASE_API_URL}/product/updateproduct/${pid}`, obj);
        alert("✅ Product Updated");
      } else {
        setPList((prev) => [...prev, obj]);
        await axios.post(`${REACT_APP_BASE_API_URL}/product/saveproduct`, obj);
        alert("✅ Product Saved");
      }

      handleNewButton();
      setTimeout(fetchProducts, 500);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewButton = () => {
    getNewPid();
    setPName("");
    setPPrice("");
    setOPrice("");
    setPPicName("");
    setPCatgId("");
    setImage({ preview: "", data: "" });
    setIsEditing(false);
  };

  const handleEdit = (item) => {
    setPId(item.pid);
    setPName(item.pname);
    setPPrice(item.pprice);
    setOPrice(item.oprice);
    setPPicName(item.ppicname);
    setPCatgId(item.pcatgid);

    //  Handle if image is missing
    if (item.ppicname && item.ppicname.startsWith("http")) {
      setImage({ preview: item.ppicname, data: "" });
    } else {
      setImage({ preview: "", data: "" });
    }

    setIsEditing(true);
  };

  const handleDelete = (pid) => {
    if (window.confirm("Delete this product?")) {
      axios
        .put(`${REACT_APP_BASE_API_URL}/product/updateproductstatus/${pid}/Inactive`)
        .then(() => {
          alert("🗑️ Product Deleted");
          fetchProducts();
        })
        .catch((err) => alert(err));
    }
  };

  // 🌀 Full-screen loading spinner
  const SpinnerOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(255,255,255,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div className="loader"></div>
      <style>
        {`
          .loader {
            border: 8px solid #f3f3f3;
            border-top: 8px solid #007bff;
            border-radius: 50%;
            width: 70px;
            height: 70px;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  return (
    <div style={{ padding: "20px" }}>
      {loading && <SpinnerOverlay />}
      <h2 style={{ textAlign: "center" }}>Manage Products</h2>

      <div style={cardStyle}     
      >
        <h4>{isEditing ? "Edit Product" : "Add New Product"}</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label>
            Product ID: <b>{pid}</b>
          </label>
          <input
            placeholder="Product Name"
            value={pname}
            onChange={(e) => setPName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={pprice}
            onChange={(e) => setPPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Offer Price"
            value={oprice}
            onChange={(e) => setOPrice(e.target.value)}
          />
          <select value={pcatgid} onChange={(e) => setPCatgId(e.target.value)}>
            <option value="">-- Select Category --</option>
            {pcatglist.map((cat) => (
              <option key={cat.pcatgid} value={cat.pcatgid}>
                {cat.pcatgname}
              </option>
            ))}
          </select>

          <input type="file" onChange={handleFileChange} />
          {image.preview && (
            <img
              src={image.preview}
              width="100"
              height="100"
              alt="Preview"
              style={{ borderRadius: "6px" }}
            />
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleNewButton}>New</button>
            <button onClick={handleSaveButton}>
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Product List</h3>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "700px",
          }}
        >
          <thead style={{ background: "#007bff", color: "white" }}>
            <tr>
              <th>SNO</th>
              <th>PID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Offer</th>
              <th>Category</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plist.map((item, index) => (
              <tr key={item.pid} style={{ textAlign: "center" }}>
                <td>{index + 1}</td>
                <td>{item.pid}</td>
                <td>{item.pname}</td>
                <td>{item.pprice}</td>
                <td>{item.oprice}</td>
                <td>
                  {pcatglist.find((c) => c.pcatgid === item.pcatgid)
                    ?.pcatgname || "N/A"}
                </td>
                <td>
                  {item.ppicname ? (
                    <img
                      src={item.ppicname}
                      alt={item.pname}
                      width="60"
                      height="60"
                      style={{ borderRadius: "6px" }}
                    />
                  ) : (
                    <span style={{ color: "#888" }}>No Image</span>
                  )}
                </td>
                <td>
                  <button onClick={() => handleEdit(item)}>Edit</button>
                  <button
                    onClick={() => handleDelete(item.pid)}
                    style={{ background: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const cardStyle = {
  backgroundColor: "#121a3a",
  borderRadius: "12px",
  padding: "25px",
  marginTop: "20px",
  boxShadow: "0 0 25px rgba(91,209,255,0.1)",
  
  width: "100%",
  maxWidth: "600px",
  height: "auto",
  minHeight: "200px",
  boxSizing: "border-box",

  // ✅ Center horizontally
  marginLeft: "auto",
  marginRight: "auto",
};


export default Product;
