import React, { useState, useEffect } from "react";
import axios from "axios";

function EditVenderProfile({ vender, onClose, onUpdate }) {
  const [formData, setFormData] = useState(vender);
  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [vendorList, setVendorList] = useState([]);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    setFormData(vender);
    fetchVendorList();
  }, [vender]);

  const fetchVendorList = async () => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/vender/getvendercount`);
      setVendorList(res.data);
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const checkEmailDuplicate = () => {
    return vendorList.some(
      (v) => v.VEmail === formData.VEmail && v.VUserId !== formData.VUserId
    );
  };

  const handleSubmit = async () => {
    if (checkEmailDuplicate()) {
      alert("This email is already used by another vendor!");
      return;
    }

    try {
      const form = new FormData();
      form.append("VenderName", formData.VenderName);
      form.append("VAddress", formData.VAddress);
      form.append("VContact", formData.VContact);
      form.append("VEmail", formData.VEmail);

      if (newImage) {
        form.append("file", newImage);
      }

      const res = await axios.put(
        `${REACT_APP_BASE_API_URL}/vender/update/${formData.VUserId}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
      onUpdate({ ...formData, ...res.data.updatedData });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h3>Edit Vendor Profile</h3>
      <input
        type="text"
        name="VenderName"
        value={formData.VenderName || ""}
        onChange={handleChange}
        placeholder="Vendor Name"
      />
      <br />
      <input
        type="text"
        name="VAddress"
        value={formData.VAddress || ""}
        onChange={handleChange}
        placeholder="Address"
      />
      <br />
      <input
        type="text"
        name="VContact"
        value={formData.VContact || ""}
        onChange={handleChange}
        placeholder="Contact"
      />
      <br />
      <input
        type="email"
        name="VEmail"
        value={formData.VEmail || ""}
        onChange={handleChange}
        placeholder="Email"
      />
      <br />
      {/* <p>Current Image: {formData.VPicName}</p> */}
      {formData.VPicName && (
        <img
          src={formData.VPicName}
          alt="Vendor"
          width={80}
          height={80}
          style={{ borderRadius: "50%" }}
        />
      )}
      <br />
      {previewImage && (
        <>
          <p>New Image Preview:</p>
          <img
            src={previewImage}
            alt="Preview"
            width={80}
            height={80}
            style={{ borderRadius: "50%" }}
          />
        </>
      )}
      <br />
      <input type="file" onChange={handleFileChange} />
      <br />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Cancel</button>
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

export default EditVenderProfile;
