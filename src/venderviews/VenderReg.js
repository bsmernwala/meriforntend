
// export default VenderReg;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./VenderReg.css";  

function VenderReg() {
  const [vuserid, setVUserId] = useState("");
  const [vuserpass, setVUserPass] = useState("");
  const [vrepass, setVRePass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const [vendername, setVenderName] = useState("");
  const [vaddress, setVAddress] = useState("");
  const [vcontact, setVContact] = useState("");
  const [vemail, setVEmail] = useState("");
  const [vpicname, setVPicName] = useState("");
  const [vid, setVId] = useState("");
  const [image, setImage] = useState({ preview: "", data: "" });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [vendorList, setVendorList] = useState([]);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    fetchVendorList();
  }, []);

  const fetchVendorList = async () => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/vender/getvendercount/`);
      setVendorList(res.data);
      setVId(res.data.length + 1);
    } catch (err) {
      alert(err);
    }
  };

  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!vuserid || vuserid.length < 4) {
      temp.vuserid = "User ID must be at least 4 characters";
      valid = false;
    } else if (vendorList.some((v) => v.VUserId === vuserid)) {
      temp.vuserid = "User ID already exists";
      valid = false;
    }

    if (!vuserpass || vuserpass.length < 6) {
      temp.vuserpass = "Password must be at least 6 characters";
      valid = false;
    }

    if (vrepass !== vuserpass) {
      temp.vrepass = "Passwords do not match";
      valid = false;
    }

    if (!vendername.match(/^[A-Za-z ]+$/)) {
      temp.vendername = "Vendor name must contain only letters";
      valid = false;
    }

    if (!vaddress) {
      temp.vaddress = "Address is required";
      valid = false;
    }

    if (!/^\d{10}$/.test(vcontact)) {
      temp.vcontact = "Contact must be 10 digits";
      valid = false;
    }

    if (!/\S+@\S+\.\S+/.test(vemail)) {
      temp.vemail = "Enter a valid email address";
      valid = false;
    } else if (vendorList.some((v) => v.VEmail === vemail)) {
      temp.vemail = "Email already exists";
      valid = false;
    }

    if (!image.data) {
      temp.vpicname = "Please upload a profile photo";
      valid = false;
    }

    setErrors(temp);
    return valid;
  };

  const handleRegisterButton = async () => {
    if (!validateForm()) return;

    try {
      const vendorObj = {
        VUserId: vuserid,
        VUserPass: vuserpass,
        VenderName: vendername,
        VAddress: vaddress,
        VContact: vcontact,
        VEmail: vemail,
        VPicName: "",
        Vid: vid,
        Status: "Inactive",
      };

      await axios.post(`${REACT_APP_BASE_API_URL}/vender/register/`, vendorObj);

      const formData = new FormData();
      formData.append("file", image.data);
      formData.append("VenderName", vendername);
      formData.append("VAddress", vaddress);
      formData.append("VContact", vcontact);
      formData.append("VEmail", vemail);

      const uploadRes = await axios.put(
        `${REACT_APP_BASE_API_URL}/vender/update/${vuserid}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setVPicName(uploadRes.data.updatedData.VPicName);
      setStatus("Registration and image upload successful");
      alert("Vendor Registered Successfully!");

      setVUserId("");
      setVUserPass("");
      setVRePass("");
      setVenderName("");
      setVAddress("");
      setVContact("");
      setVEmail("");
      setImage({ preview: "", data: "" });

      fetchVendorList();
    } catch (err) {
      console.error(err);
      alert("Error registering vendor or uploading image");
    }
  };

  const handleFileChange = (evt) => {
    const img = {
      preview: URL.createObjectURL(evt.target.files[0]),
      data: evt.target.files[0],
    };
    setImage(img);
  };

  return (
    <div className="venderreg-container">
      <div className="venderreg-form">
        <h2>Vendor Registration</h2>
        <p className="status">{status}</p>

        <div className="form-group">
          <label>Vendor ID</label>
          <span className="readonly">{vid}</span>
        </div>

        <div className="form-group">
          <label>User Id</label>
          <input
            type="text"
            value={vuserid}
            onChange={(e) => setVUserId(e.target.value)}
          />
          <span className="error">{errors.vuserid}</span>
        </div>

        <div className="form-group password-field">
          <label>Enter Password</label>
          <div className="input-with-icon">
            <input
              type={showPass ? "text" : "password"}
              value={vuserpass}
              onChange={(e) => setVUserPass(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPass(!showPass)}
              style={{ cursor: "pointer" }}
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <span className="error">{errors.vuserpass}</span>
        </div>

        <div className="form-group password-field">
          <label>Re-enter Password</label>
          <div className="input-with-icon">
            <input
              type={showRePass ? "text" : "password"}
              value={vrepass}
              onChange={(e) => setVRePass(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowRePass(!showRePass)}
              style={{ cursor: "pointer" }}
            >
              {showRePass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <span className="error">{errors.vrepass}</span>
        </div>

        <div className="form-group">
          <label>Vendor Name</label>
          <input
            type="text"
            value={vendername}
            onChange={(e) => setVenderName(e.target.value)}
          />
          <span className="error">{errors.vendername}</span>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={vaddress}
            onChange={(e) => setVAddress(e.target.value)}
          />
          <span className="error">{errors.vaddress}</span>
        </div>

        <div className="form-group">
          <label>Contact</label>
          <input
            type="number"
            value={vcontact}
            onChange={(e) => setVContact(e.target.value)}
          />
          <span className="error">{errors.vcontact}</span>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={vemail}
            onChange={(e) => setVEmail(e.target.value)}
          />
          <span className="error">{errors.vemail}</span>
        </div>

        <div className="form-group">
          <label>Upload Photo</label>
          <input type="file" onChange={handleFileChange} />
          {image.preview && (
            <img src={image.preview} alt="preview" className="preview" />
          )}
          <span className="error">{errors.vpicname}</span>
        </div>

        <div className="form-actions">
          <button onClick={handleRegisterButton} className="btn btn-primary">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default VenderReg;
