import React, { useEffect, useState } from "react";
import axios from "axios";
import BillHeader from "./BillHeader";
import BillItemsTable from "./BillItemsTable";
import BillSummary from "./BillSummary";
import Receipt from "./Receipt";
import "./bill.css";
import jsPDF from "jspdf";

function Bill({ data, onClose, onClearCart }) {
  const [custDetails, setCustDetails] = useState({});
  const [date, setDate] = useState("");
  const [items, setItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [billId, setBillId] = useState(null);
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  const totalAmount = items?.reduce(
    (sum, item) => sum + item.oprice * (quantities[item.pid] || 0),
    0
  ) || 0;

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const timer = setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setLoading(false), 800);
      }, 1500);

      try {
        const res = await axios.get(`${REACT_APP_BASE_API_URL}/bill/getbillid/`);
        const newBillId = parseInt(res.data[0].billid) + 1;
        setBillId(newBillId);

        setItems(data?.selitems || []);
        fetchCustomerDetails();
        setDate(formatDate(new Date()));

        const initialQuantities = {};
        (data?.selitems || []).forEach((item) => {
          initialQuantities[item.pid] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Init error:", err);
      }

      return () => clearTimeout(timer);
    };

    init();
  }, [data]);

  const fetchCustomerDetails = async () => {
    try {
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/customer/getcustomerdetails/${data.cid}`);
      setCustDetails(res.data);
    } catch (err) {
      alert("Customer details error: " + err);
    }
  };

  const formatDate = (dateObj) => {
    const d = dateObj.getDate();
    const m = dateObj.getMonth() + 1;
    const y = dateObj.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const saveBill = async () => {
    const filteredItems = items.filter((item) => quantities[item.pid] > 0);

    await Promise.all(
      filteredItems.map((item) => {
        const billObj = {
          billid: billId,
          billdate: formatDate(new Date()),
          cid: data.cid,
          pid: item.pid,
          qty: quantities[item.pid] || 1,
        };
        return axios.post(`${REACT_APP_BASE_API_URL}/bill/billsave`, billObj);
      })
    );
  };

  const displayRazorpay = async () => {
    if (isPaymentDone) {
      alert("Payment already completed");
      return;
    }

    await saveBill();

    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Failed to load Razorpay SDK");
      return;
    }

    const result = await axios.post(`${REACT_APP_BASE_API_URL}/payment/orders/${totalAmount * 100}`);
    if (!result) {
      alert("Server error");
      return;
    }

    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_8CxHBNuMQt1Qn8",
      amount: amount.toString(),
      currency,
      name: "Universal Informatics Pvt. Ltd. Indore",
      description: "Test Transaction",
      image: "/logo192.png",
      order_id,
      handler: async function (response) {
        const dataPayload = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          cid: data.cid,
          billid: billId,
          amount: amount / 100,
        };

        try {
          const result = await axios.post(`${REACT_APP_BASE_API_URL}/paymentdetails/paymentdetailsave`, dataPayload);
          if (result.data === "payment details saved successfully") {
            setIsPaymentDone(true);
            if (typeof onClearCart === "function") onClearCart();
            if (typeof onClose === "function") setTimeout(() => onClose(), 6000);
          }
        } catch (err) {
          alert("Payment error: " + err);
        }
      },
      prefill: {
        name: "Universal Informatics",
        email: "universal@gmail.com",
        contact: "9999999999",
      },
      notes: {
        address: "Universal Informatics Pvt. Ltd.",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

  const downloadPDF = async () => {
    const doc = new jsPDF();
    const filteredItems = items.filter((item) => quantities[item.pid] > 0);
    const itemsWithBase64Images = await Promise.all(
      filteredItems.map(async (item) => {
        const imageUrl = `${REACT_APP_BASE_API_URL}/product/getproductimage/${item.ppicname}`;
        const base64 = await toDataURL(imageUrl);
        return { ...item, base64Image: base64 };
      })
    );

    let y = 20;
    doc.setFontSize(16);
    doc.setFont("Times New Roman", "Italic", 40);
    doc.text("Customer-Invoice", 80, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Customer ID: ${custDetails.Cid}`, 10, y); y += 7;
    doc.text(`Name       : ${custDetails.CustomerName}`, 10, y); y += 7;
    doc.text(`Address    : ${custDetails.CAddress}`, 10, y); y += 7;
    doc.text(`Contact    : ${custDetails.CContact}`, 10, y); y += 7;
    doc.text(`Bill Date  : ${date}`, 10, y); y += 10;

    doc.setFontSize(13);
    doc.text("Products", 10, y); y += 8;
    doc.setFontSize(11);
    doc.text("ID", 10, y);
    doc.text("Name", 30, y);
    doc.text("Price", 80, y);
    doc.text("Qty", 110, y);
    doc.text("Amount", 130, y);
    doc.text("Image", 150, y);
    y += 5;

    let total = 0;
    itemsWithBase64Images.forEach((item) => {
      doc.text(`${item.pid}`, 10, y);
      doc.text(`${item.pname}`, 30, y);
      doc.text(`Rs${item.oprice}`, 80, y);
      doc.text(`${quantities[item.pid] || 1}`, 110, y);
      let amount = item.oprice * (quantities[item.pid] || 1);
      doc.text(`Rs${amount}`, 130, y);

      if (item.base64Image) {
        doc.addImage(item.base64Image, "JPEG", 150, y - 5, 20, 20);
      }

      total += amount;
      y += 25;
    });

    doc.setFontSize(14);
    doc.text(`Total Amount: Rs${total}`, 10, y + 5);
    doc.save(`CID_${custDetails.Cid}_Invoice_${billId}.pdf`);
  };

  if (loading) {
    return (
      <div className={`loader-wrapper ${fadeOut ? "fade-out" : ""}`}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="bill-wrapper" id="bill-content">
      <BillHeader cid={data.cid} custDetails={custDetails} date={date} />
      <BillItemsTable items={items} quantities={quantities} setQuantities={setQuantities} />
      <BillSummary total={totalAmount} isPaid={isPaymentDone} onPay={displayRazorpay} onDownload={downloadPDF} />

      {isPaymentDone && billId && (
        <>
          {!showReceipt && (
            <button onClick={() => setShowReceipt(true)} style={{ marginTop: "15px" }}>
              View Receipt
            </button>
          )}
          {showReceipt && (
            <Receipt billid={billId} onClose={() => setShowReceipt(false)} />
          )}
        </>
      )}
    </div>
  );
}

export default Bill;
