import React, { useState, useEffect } from "react";
import axios from "axios";

function UpdateOrderStatus({updatedByName}) {
  const [billIds, setBillIds] = useState([]);
  const [billid, setBillid] = useState("");
  const [status, setStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const[updatedAt,setupdatedAt]=useState();
  const[updatedBy,setupdatedBy]=useState();

  //read env variable for base API URL
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Load all bill IDs
  useEffect(() => {
    //alert(updatedByName)
    axios
      .get(REACT_APP_BASE_API_URL+"/bill/allbillids")
      .then((res) => setBillIds(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Load current status when Bill ID changes
  useEffect(() => {
    if (billid) {
     axios
        .get(`${REACT_APP_BASE_API_URL}/bill/getstatus/${billid}`)
        .then((res) => {
          setCurrentStatus(res.data.status);
          setupdatedAt(res.data.updatedAt);
          setupdatedBy(res.data.updatedBy);
          
        })
        .catch(() => setCurrentStatus(""));
    }
  }, [billid]);

  const updateStatus = async () => {
    if (!billid || !status) {
      alert("Please select Bill ID and Status");
      return;
    }
  await axios.put(REACT_APP_BASE_API_URL+"/bill/updatestatus", {
  billid,
  status,
  updatedBy: updatedByName   // or Vendor ID or Username
});
    alert("Order Status Updated Successfully");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Update Order Status By {updatedByName}</h2>

      {/* Bill ID Dropdown */}
      <label>Select Bill ID:</label>
      <select
        value={billid}
        onChange={(e) => setBillid(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      >
        <option value="">-- Select Bill ID --</option>
        {billIds.map((id, index) => (
          <option key={index} value={id}>
            {id}
          </option>
        ))}
      </select>

      {/* Show current status */}
      {currentStatus && (
        <div>
        <p>
          <strong>Current Status:</strong>{" "}
          <span style={{ color: "blue" }}>{currentStatus}</span>
        </p>
        <p>
  Last Updated At: {new Date(updatedAt).toLocaleString()}
</p>
<p>
  Last Updated By: <b>{updatedBy}</b>
</p>
</div>
      )}

      {/* New Status Dropdown */}
      <label>Set New Status:</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        style={{ display: "block", margin: "10px 0" }}
      >
        <option value="">-- Select New Status --</option>
        <option>Processing</option>
        <option>Order Placed</option>
        <option>Packed</option>
        <option>Shipped</option>
        <option>Out for Delivery</option>
        <option>Delivered</option>
        <option>Cancelled</option>
      </select>

      <button onClick={updateStatus}>Update Status</button>
    </div>
  );
}
export default UpdateOrderStatus;
