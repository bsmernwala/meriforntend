
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import logo from "../logo.svg";

function Bill({ data, onBack, onPaymentSuccess, onUpdateCart, onRemoveItem }) {
  const [customer, setCustomer] = useState({
    name: "",
    address: "",
    contact: "",
  });

  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [billId, setBillId] = useState("");
 //get env
 const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // -----------------------
  //  Helper: Format Date
  // -----------------------
  const getCurrentDate = () => {
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
  };

  // -----------------------------------
  //  Load Customer & Item Information
  // -----------------------------------
  useEffect(() => {
    if (!data || !data.cid || !data.selitems) return;

    setItems(data.selitems);
    setDate(getCurrentDate());

    // Initialize qty
    const qtyObj = {};
    data.selitems.forEach((item) => {
      qtyObj[item.pid] = data.quantities?.[item.pid] || 1;
    });
    setQuantities(qtyObj);

    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${data.cid}`)
      .then((res) => {
        setCustomer({
          name: res.data.CustomerName,
          address: res.data.CAddress,
          contact: res.data.CContact,
        });
      })
      .catch((err) => alert(err));
  }, [data]);

  // ----------------------
  // Total Calculation
  // ----------------------
  const totalAmount = items.reduce(
    (acc, item) => acc + item.oprice * (quantities[item.pid] || 1),
    0
  );

  // ------------------------------
  // Quantity Increase/Decrease
  // ------------------------------
  const increaseQty = (pid) => {
    setQuantities((prev) => {
      const newQty = (prev[pid] || 1) + 1;
      onUpdateCart?.(pid, newQty);
      return { ...prev, [pid]: newQty };
    });
  };

  const decreaseQty = (pid) => {
    setQuantities((prev) => {
      const newQty = Math.max((prev[pid] || 1) - 1, 1);
      onUpdateCart?.(pid, newQty);
      return { ...prev, [pid]: newQty };
    });
  };

  // ----------------------
  // Remove Item
  // ----------------------
  const removeItemHandler = (pid) => {
    setItems((prev) => prev.filter((item) => item.pid !== pid));

    setQuantities((prev) => {
      const q = { ...prev };
      delete q[pid];
      return q;
    });

    onRemoveItem?.(pid);
  };

  // ---------------------------
  // Load Razorpay Script
  // ---------------------------
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  // --------------------
  // Save Bill in DB
  // --------------------
  const saveBill = useCallback(async () => {
    if (!items.length) return;

    const res = await axios.get(`${REACT_APP_BASE_API_URL}/bill/getbillid/`);
    const nextId = parseInt(res.data[0].billid) + 1;
    setBillId(nextId);

    const today = getCurrentDate();

    for (const item of items) {
      const qty = quantities[item.pid];
      const subtotal = item.oprice * qty;

      await axios.post(`${REACT_APP_BASE_API_URL}/bill/billsave`, {
        billid: nextId,
        billdate: today,
        cid: data.cid,
        pid: item.pid,
        qty,
      });

      await axios.post(`${REACT_APP_BASE_API_URL}/sales/add`, {
        venderId: item.vid,
        productId: item.pid,
        quantity: qty,
        totalPrice: subtotal,
        billid: nextId,
        date: today,
      });
    }

    return nextId;
  }, [items, quantities, data.cid]);

  // -------------------------
  // Payment + Razorpay
  // -------------------------
  const displayRazorpay = async () => {
    if (isPaymentDone) return alert("Payment already done!");

    if (!items.length) return alert("No items in bill!");

    const savedBillId = await saveBill();

    const loaded = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!loaded) return alert("Failed to load Razorpay");

    const amountInPaisa = totalAmount * 100;

    const order = await axios.post(`${REACT_APP_BASE_API_URL}/payment/orders/${amountInPaisa}`
    );

    const { id: order_id, amount, currency } = order.data;

    const options = {
      key: "rzp_test_8CxHBNuMQt1Qn8",
      amount: amount.toString(),
      currency,
      name: "Universal Informatics Pvt. Ltd.",
      description: "Test Transaction",
      image: { logo },
      order_id,
      handler: async function (response) {
        await axios.post(`${REACT_APP_BASE_API_URL}/paymentdetails/paymentdetailsave`, {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          cid: data.cid,
          amount: amount / 100,
          billid: savedBillId,
        });

        setIsPaymentDone(true);
        alert("Payment Successful!");
        onPaymentSuccess?.();
      },
      prefill: {
        name: customer.name,
        email: "universal@gmail.com",
        contact: customer.contact || "9999999999",
      },
      notes: { address: "Universal Informatics Indore Pvt. Ltd." },
      theme: { color: "#61dafb" },
    };

    new window.Razorpay(options).open();
  };

  // -----------------------------------------------------
  // UI Rendering (Clean JSX)
  // -----------------------------------------------------
  return (
    <div style={{ padding: 20 }}>
      <h4>Customer Invoice</h4>

      <button onClick={onBack} style={{ marginBottom: 10 }}>
        ⬅ Back to Product List
      </button>

      {!data ? (
        <div style={{ color: "red" }}>No billing data available</div>
      ) : (
        <>
          <table>
            <tbody>
              <tr><td>Customer ID</td><td>{data.cid}</td></tr>
              <tr><td>Name</td><td>{customer.name}</td></tr>
              <tr><td>Address</td><td>{customer.address}</td></tr>
              <tr><td>Contact</td><td>{customer.contact}</td></tr>
              <tr><td>Bill Date</td><td>{date}</td></tr>
            </tbody>
          </table>

          <center>
            <h4 style={{ background: "green", color: "white" }}>Bill</h4>

            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th>Photo</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => {
                  const qty = quantities[item.pid];
                  const subtotal = item.oprice * qty;

                  return (
                    <tr key={item.pid}>
                      <td>{item.pid}</td>
                      <td>{item.pname}</td>

                      <td>
                        <button onClick={() => decreaseQty(item.pid)}>-</button>
                        <span style={{ margin: "0 8px" }}>{qty}</span>
                        <button onClick={() => increaseQty(item.pid)}>+</button>
                      </td>

                      <td>₹{item.oprice}</td>
                      <td>₹{subtotal}</td>

                      <td>
                        <img src={item.ppicname} height="50" width="50" alt="" />
                      </td>

                      <td>
                        <button
                          onClick={() => removeItemHandler(item.pid)}
                          style={{
                            background: "red",
                            color: "white",
                            padding: "5px 10px",
                            borderRadius: 5,
                            border: "none",
                          }}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <h4 style={{ background: "green", color: "white" }}>
              Total Amount = ₹{totalAmount}
            </h4>

            <button
              onClick={displayRazorpay}
              disabled={!items.length}
              style={{
                padding: "10px 20px",
                backgroundColor: items.length ? "#007bff" : "gray",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: items.length ? "pointer" : "not-allowed",
              }}
            >
              Pay Now
            </button>
          </center>
        </>
      )}
    </div>
  );
}

export default Bill;
