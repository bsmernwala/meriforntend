import React, { useEffect, useState } from "react";
import axios from "axios";

function CustomerProfile() {
  const [profile, setProfile] = useState({
    CustomerName: "",
    StId: "",
    CtId: "",
    CAddress: "",
    CContact: "",
    CEmail: "",
    CPicName: ""
  });

  const cid = JSON.parse(localStorage.getItem("userSession"))?.cid; 
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    axios.get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
      .then(res => setProfile(res.data))
      .catch(err => console.error(err));
  }, [cid]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    axios.put(`${REACT_APP_BASE_API_URL}/customer/update/${cid}`, profile)
      .then(res => {
        alert(res.data.message);
        setProfile(res.data.customer);
      })
      .catch(err => alert("Error updating profile"));
  };


const handleFileUpload = async (e) => {
  const formData = new FormData();
  formData.append("file", e.target.files[0]);

  try {
    const res = await axios.post(`${REACT_APP_BASE_API_URL}/customer/savecustomerimage`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setProfile({ ...profile, CPicName: res.data.filename }); // store file name
  } catch (err) {
    console.error("File upload failed", err);
  }
};

  return (
    <div>
      <h3>Edit Profile</h3>
      <input name="CustomerName" value={profile.CustomerName} onChange={handleChange} placeholder="Full Name" />
      <input name="StId" value={profile.StId} onChange={handleChange} placeholder="State ID" />
      <input name="CtId" value={profile.CtId} onChange={handleChange} placeholder="City ID" />
      <input name="CAddress" value={profile.CAddress} onChange={handleChange} placeholder="Address" />
      <input name="CContact" value={profile.CContact} onChange={handleChange} placeholder="Contact" />
      <input type="email" name="CEmail" value={profile.CEmail} onChange={handleChange} placeholder="Email" />
      <input name="CPicName" value={profile.CPicName} onChange={handleChange} placeholder="Profile Picture Name" />
      <input type="file" onChange={handleFileUpload} />
      <button onClick={handleUpdate}>Update Profile</button>
    </div>
  );
}

export default CustomerProfile;
