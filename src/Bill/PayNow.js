// PayNow.js
import React from "react";

function PayNow({ amount, customerData, onSuccess }) {
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  const loadRazorpay = async () => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = async () => {
      const response = await fetch(`${REACT_APP_BASE_API_URL}/payment/orders/${amount * 100}`, {
        method: "POST",
      });
      const { amount: razorAmount, id: order_id, currency } = await response.json();

      const options = {
        key: "rzp_test_8CxHBNuMQt1Qn8",
        amount: razorAmount,
        currency,
        name: "Universal Informatics Pvt. Ltd. Indore",
        description: "Test Transaction",
        image: "/logo192.png",
        order_id,
        handler: async (razorpayResponse) => {
          const dataPayload = {
            orderCreationId: order_id,
            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
            razorpayOrderId: razorpayResponse.razorpay_order_id,
            razorpaySignature: razorpayResponse.razorpay_signature,
            cid: customerData.cid,
            billid: customerData.billid,
            amount: amount,
          };

          await fetch(`${REACT_APP_BASE_API_URL}/paymentdetails/paymentdetailsave`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataPayload),
          });

          onSuccess(); // tell parent payment succeeded
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
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed by user");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    };
  };

  return (
    <button onClick={loadRazorpay} style={{ marginTop: "15px" }}>
      Pay Now
    </button>
  );
}

export default PayNow;
