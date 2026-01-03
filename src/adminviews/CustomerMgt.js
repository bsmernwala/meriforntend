//  
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

function CustomerMgt() {
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [formData, setFormData] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    cid: null,
    currentStatus: "",
  });
  const [loading, setLoading] = useState(false);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // 🌩️ Cloudinary Base URL
  const cloudinaryBase = "https://res.cloudinary.com/dhuiiisxy/image/upload/";
  
  // Fetch customers and states
  useEffect(() => {
    //axios.get(`${REACT_APP_BASE_API_URL}/productcatg/showproductcatg`)
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomercount`)
      
      .then((res) => setCustomerList(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${REACT_APP_BASE_API_URL}/state/show`)
      .then((res) => setStates(res.data))
      .catch((err) => console.error(err));
  }, []);

  // 🧭 Open profile modal
  const handleViewProfile = (cid) => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
      .then((res) => {
        setSelectedCustomer(res.data);
        setFormData(res.data);

        const imageName = res.data.CPicName || res.data.cpicname;
        let imgUrl = null;

        if (imageName) {
          imgUrl = imageName.startsWith("http")
            ? imageName
            : `${cloudinaryBase}${imageName}`;
        }

        setPreviewImage(imgUrl);
        if (res.data.StId) fetchCitiesByState(res.data.StId);
        setOpenProfile(true);
      })
      .catch((err) => console.error(err));
  };

  // 🏙️ Fetch cities by state
  const fetchCitiesByState = (stid) => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/city/showcitybystate/${stid}`)
      .then((res) => setCities(res.data))
      .catch((err) => console.error(err));
  };

  // 🔤 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "StId") {
      setFormData((prev) => ({ ...prev, CtId: "" }));
      fetchCitiesByState(value);
    }
  };

  // 🖼️ File input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, CPicFile: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 💾 Save updated profile
  const handleSaveProfile = async () => {
    const data = new FormData();
    data.append("CustomerName", formData.CustomerName);
    data.append("CAddress", formData.CAddress);
    data.append("CContact", formData.CContact);
    data.append("CEmail", formData.CEmail);
    data.append("CUserId", formData.CUserId);
    data.append("StId", formData.StId);
    data.append("CtId", formData.CtId);
    if (formData.CPicFile) data.append("CPicName", formData.CPicFile);

    try {
      setLoading(true);
      const res = await axios.put(
        `${REACT_APP_BASE_API_URL}/customer/update/${selectedCustomer.Cid}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("✅ Profile updated successfully!");
      setCustomerList((prev) =>
        prev.map((c) =>
          c.Cid === selectedCustomer.Cid ? res.data.customer : c
        )
      );
      setOpenProfile(false);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : "Server error");
      alert(`⚠️ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Status toggle
  const handleToggleStatusClick = (cid, currentStatus) => {
    setConfirmDialog({ open: true, cid, currentStatus });
  };

  const handleConfirmToggle = () => {
    const { cid, currentStatus } = confirmDialog;
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    setCustomerList((prev) =>
      prev.map((c) => (c.Cid === cid ? { ...c, Status: newStatus } : c))
    );

    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${cid}`)
      .then((res) => {
        const email = res.data.CEmail;
        axios
          .put(`${REACT_APP_BASE_API_URL}/customer/customermanage/${cid}/${newStatus}`)
          .then(() => {
            const subject =
              newStatus === "Active" ? "Login Activation" : "Login Deactivation";
            const message =
              newStatus === "Active"
                ? "Your ID is activated by admin. You can login now."
                : "Your ID is inactivated by admin. You cannot login.";
            axios
              .post(
                `${REACT_APP_BASE_API_URL}/emailactivation/sendemails/${email}/${subject}/${message}`
              )
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));

    setConfirmDialog({ open: false, cid: null, currentStatus: "" });
  };

  return (
    <Box sx={{ padding: 3, position: "relative" }}>
      <Typography variant="h4" gutterBottom>
        Customer Management
      </Typography>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(255,255,255,0.6)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      )}

      {/* 🧍 Customer Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Customer Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Profile</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerList.map((cust) => {
              const imageName = cust.CPicName || cust.cpicname;
              const imageUrl = imageName
                ? imageName.startsWith("http")
                  ? imageName
                  : `${cloudinaryBase}${imageName}`
                : "/default-avatar.png";

              return (
                <TableRow key={cust.Cid}>
                  <TableCell>
                    <Avatar
                      src={imageUrl}
                      alt={cust.CustomerName}
                      sx={{ width: 50, height: 50 }}
                      onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                  </TableCell>
                  <TableCell>{cust.Cid}</TableCell>
                  <TableCell>{cust.CustomerName}</TableCell>
                  <TableCell>
                    <Button
                      variant={cust.Status === "Active" ? "contained" : "outlined"}
                      color={cust.Status === "Active" ? "success" : "error"}
                      onClick={() =>
                        handleToggleStatusClick(cust.Cid, cust.Status)
                      }
                    >
                      {cust.Status}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewProfile(cust.Cid)}
                    >
                      View / Edit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 🧾 Profile Edit Modal */}
      <Dialog open={openProfile} onClose={() => setOpenProfile(false)}>
        <DialogTitle>Customer Profile</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="CustomerName"
            value={formData.CustomerName || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="CEmail"
            value={formData.CEmail || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Address"
            name="CAddress"
            value={formData.CAddress || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Contact"
            name="CContact"
            value={formData.CContact || ""}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="StId"
              value={formData.StId || ""}
              onChange={handleChange}
              label="State"
            >
              {states.map((st) => (
                <MenuItem key={st.stid} value={st.stid}>
                  {st.stname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>City</InputLabel>
            <Select
              name="CtId"
              value={formData.CtId || ""}
              onChange={handleChange}
              label="City"
            >
              {cities.map((ct) => (
                <MenuItem key={ct.ctid} value={ct.ctid}>
                  {ct.ctname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* 🖼️ Profile Image Upload */}
          <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            {previewImage && (
              <Avatar src={previewImage} sx={{ width: 80, height: 80 }} />
            )}
            <input type="file" onChange={handleFileChange} />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenProfile(false)}>Cancel</Button>
          <Button onClick={handleSaveProfile} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ⚙️ Confirm Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({ open: false, cid: null, currentStatus: "" })
        }
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          Are you sure you want to{" "}
          {confirmDialog.currentStatus === "Active" ? "deactivate" : "activate"}{" "}
          this customer?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDialog({ open: false, cid: null, currentStatus: "" })
            }
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmToggle} variant="contained">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CustomerMgt;
