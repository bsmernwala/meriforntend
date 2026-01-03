
import React, { useEffect, useState } from "react";
import axios from "axios";
 import "./CustomerReg.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function CustomerReg() {
  const [cuserid, setCUserId] = useState("");
  const [cuserpass, setCUserPass] = useState("");
  const [customername, setCustomerName] = useState("");
  const [stid, setStId] = useState("");
  const [ctid, setCtId] = useState("");
  const [caddress, setCAddress] = useState("");
  const [ccontact, setCContact] = useState("");
  const [cemail, setCEmail] = useState("");
  const [cpicname, setCPicName] = useState("");
  const [cid, setCId] = useState("");
  const [image, setImage] = useState({ preview: "", data: "" });
  const [status, setStatus] = useState("");
  const [stlist, setStList] = useState([]);
  const [ctlist, setCtList] = useState([]);
  const [errors, setErrors] = useState({});
const [showPassword, setShowPassword] = useState(false);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // ------------------ Fetch States & Customer Count ------------------
  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomercount/`)
      .then((res) => setCId(res.data.length + 1))
      .catch((err) => alert(err));

    axios
      .get(`${REACT_APP_BASE_API_URL}/state/show/`)
      .then((res) => setStList(res.data))
      .catch((err) => alert(err));
  }, []);

  // ------------------ Handle State Change ------------------
  const handleStIdSelect = (evt) => {
    setStId(evt.target.value);
    axios
      .get(`${REACT_APP_BASE_API_URL}/city/showcitybystate/${evt.target.value}`)
      .then((res) => setCtList(res.data))
      .catch((err) => alert(err));
  };

  // ------------------ Validation ------------------
  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!cuserid || cuserid.length < 4) {
      temp.cuserid = "User ID must be at least 4 characters";
      valid = false;
    }
    if (!cuserpass || cuserpass.length < 6) {
      temp.cuserpass = "Password must be at least 6 characters";
      valid = false;
    }
    if (!customername.match(/^[A-Za-z ]+$/)) {
      temp.customername = "Customer name must contain only letters";
      valid = false;
    }
    if (!stid) {
      temp.stid = "Please select a state";
      valid = false;
    }
    if (!ctid) {
      temp.ctid = "Please select a city";
      valid = false;
    }
    if (!caddress) {
      temp.caddress = "Address is required";
      valid = false;
    }
    if (!/^\d{10}$/.test(ccontact)) {
      temp.ccontact = "Contact must be 10 digits";
      valid = false;
    }
    if (!/\S+@\S+\.\S+/.test(cemail)) {
      temp.cemail = "Enter a valid email address";
      valid = false;
    }
    if (!image.data) {
      temp.cpicname = "Please upload a profile photo";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  // ------------------ Register Customer ------------------
  const handleRegisterButton = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Step 1: Upload image to backend (Cloudinary/local hybrid)
      const formData = new FormData();
      formData.append("file", image.data);

      const uploadRes = await fetch(`${REACT_APP_BASE_API_URL}/customer/savecustomerimage`, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadRes.ok) {
        setStatus("File uploaded successfully");

        const imageUrl = uploadData.imageUrl; // ✅ Cloudinary/local URL
        setCPicName(imageUrl);

        // Step 2: Register customer with uploaded image URL
        const obj = {
          CUserId: cuserid,
          CUserPass: cuserpass,
          CustomerName: customername,
          StId: stid,
          CtId: ctid,
          CAddress: caddress,
          CContact: ccontact,
          CEmail: cemail,
          CPicName: imageUrl,
          Cid: cid,
          Status: "Inactive",
        };

        const regRes = await axios.post(`${REACT_APP_BASE_API_URL}/customer/register/`, obj);

        alert("✅ " + regRes.data.message || "Registration Successful!");

      } else {
        alert("❌ Image upload failed: " + uploadData.message);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("❌ Something went wrong during registration");
    }
  };

  // ------------------ Handle File Change ------------------
  const handleFileChange = (evt) => {
    const img = {
      preview: URL.createObjectURL(evt.target.files[0]),
      data: evt.target.files[0],
    };
    setImage(img);
    setCPicName(evt.target.files[0].name);
  };

  // ------------------ JSX ------------------
  return (
    <div className="customerreg-container">
      <div className="customerreg-form">
        <h2>Customer Registration</h2>
        <p className="status">{status}</p>

        <form onSubmit={handleRegisterButton}>
          <div className="form-group">
            <label>Customer Id</label>
            <span className="readonly">{cid}</span>
          </div>

          <div className="form-group">
            <label>User Id</label>
            <input type="text" onChange={(e) => setCUserId(e.target.value)} />
            <span className="error">{errors.cuserid}</span>
          </div>

          <div className="form-group">
            {/* <label>Password</label>
            <input type="password" onChange={(e) => setCUserPass(e.target.value)} />
            <span className="error">{errors.cuserpass}</span> */}
            <div className="password-field">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={cuserpass}
                      onChange={(e) => setCUserPass(e.target.value)}
                    />
                    <span
                      className="eye-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                     <span className="error">{errors.cuserpass}</span>
                  </div>
          </div>

          <div className="form-group">
            <label>Customer Name</label>
            <input type="text" onChange={(e) => setCustomerName(e.target.value)} />
            <span className="error">{errors.customername}</span>
          </div>

          <div className="form-group">
            <label>State</label>
            <select onChange={handleStIdSelect}>
              <option value="">--Select State--</option>
              {stlist.map((items) => (
                <option key={items.stid} value={items.stid}>
                  {items.stname}
                </option>
              ))}
            </select>
            <span className="error">{errors.stid}</span>
          </div>

          <div className="form-group">
            <label>City</label>
            <select onChange={(e) => setCtId(e.target.value)}>
              <option value="">--Select City--</option>
              {ctlist.map((items) => (
                <option key={items.ctid} value={items.ctid}>
                  {items.ctname}
                </option>
              ))}
            </select>
            <span className="error">{errors.ctid}</span>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" onChange={(e) => setCAddress(e.target.value)} />
            <span className="error">{errors.caddress}</span>
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input type="number" onChange={(e) => setCContact(e.target.value)} />
            <span className="error">{errors.ccontact}</span>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" onChange={(e) => setCEmail(e.target.value)} />
            <span className="error">{errors.cemail}</span>
          </div>

          <div className="form-group">
            <label>Select Photo</label>
            <input type="file" onChange={handleFileChange} />
            {image.preview && (
              <img
                src={image.preview}
                width="100"
                height="100"
                alt="preview"
                style={{ borderRadius: "10px", marginTop: "8px" }}
              />
            )}
            <span className="error">{errors.cpicname}</span>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CustomerReg;

