//working 
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ShowBills() {
  const [custlist, setCustList] = useState([]);
  const [billdetailslist, setBillDetailsList] = useState([]);
  const [plist, setPList] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [loadingPDF, setLoadingPDF] = useState(false);

  //read env 
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const billsPerPage = 3;

  useEffect(() => {
    axios
      .get(`${REACT_APP_BASE_API_URL}/customer/getcustomerlist`)
      .then((res) => setCustList(res.data))
      .catch((err) => alert(err));

    axios
      .get(`${REACT_APP_BASE_API_URL}/product/showproduct`)
      .then((res) => setPList(res.data))
      .catch((err) => alert(err));
  }, []);

  const handleCustomerSelect = (evt) => {
    const cid = evt.target.value;
    setSelectedCustomer(cid);
    axios
      .get(`${REACT_APP_BASE_API_URL}/bill/billshow/${cid}`)
      .then((res) => {
        const bills = res.data;
        const mergedBills = [];
        let totalSum = 0;

        bills.forEach((bitem) => {
          const productData = plist.find((p) => p.pid === bitem.pid);
          if (productData) {
            const product = {
              pname: productData.pname,
              price: parseFloat(productData.oprice),
              qty: bitem.qty || 1,
              subtotal:
                parseFloat(productData.oprice) * (bitem.qty || 1),
              pic: productData.ppicname,
            };

            let existingBill = mergedBills.find(
              (bill) => bill.billid === bitem.billid
            );
            if (!existingBill) {
              existingBill = {
                billid: bitem.billid,
                cid: bitem.cid,
                billdate: bitem.billdate,
                products: [],
                total: 0,
              };
              mergedBills.push(existingBill);
            }

            existingBill.products.push(product);
            existingBill.total += product.subtotal;
            totalSum += product.subtotal;
          }
        });

        setBillDetailsList(mergedBills);
        setGrandTotal(totalSum);
        setCurrentPage(1);
      })
      .catch((err) => alert(err));
  };

  // Pagination
  const indexOfLast = currentPage * billsPerPage;
  const indexOfFirst = indexOfLast - billsPerPage;
  const currentBills = billdetailslist.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(billdetailslist.length / billsPerPage);

  // ✅ Utility: Convert image URL → Base64 for PDF
  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Image load error:", err);
      return null;
    }
  };

  // ✅ PDF Export with Images
  const downloadPDF = async () => {
    //const rupee = "₹"; // or just type it directly
 setLoadingPDF(true); // show spinner/text
  const doc = new jsPDF();
  //doc.setFontSize(16);
 // doc.text("Customer Bills Report", 14, 15);
 try{
 const pageWidth = doc.internal.pageSize.getWidth();
doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const title = "Customer Bills Report";
  const textWidth = doc.getTextWidth(title);
  const textX = (pageWidth - textWidth) / 2;
  doc.text(title, textX, 12);

  const customer = custlist.find((c) => c.Cid === selectedCustomer);
//alert(custlist.length)
  //alert("customer data="+selectedCustomer+"cust="+custlist[10].Cid+"ciidd="+customer.CustomerName)
 var found=false
  for(var i=0;i<custlist.length;i++)
  {
    if(custlist[i].Cid==selectedCustomer)
    {
      //customer1={Cid:custlist[i].Cid,
      //  CustomerName:custlist[i].CustomerName
     found=true;
      break;
      }
    
  }
if(found==true)
{
     doc.setFontSize(12);
    doc.text(`Customer: ${custlist[i].CustomerName} (${custlist[i].Cid})`, 14, 25);
  
}

  //alert("Name customer="+custlist[i].CustomerName)
 //doc.text("Hello"+custlist[i].CustomerName,5,10)
  if (customer) {
    doc.setFontSize(12);
    doc.text(`Customer: ${customer.CustomerName} (${customer.Cid})`, 14, 25);
  }

  let yPos = 35;

  for (const bill of billdetailslist) {
    doc.setFontSize(13);
    doc.text(`Bill ID: ${bill.billid} | Date: ${bill.billdate}`, 14, yPos);
    yPos += 6;

    // Prepare rows but store base64 image separately (not in table text)
    const rows = [];
    const imageMap = {};

    for (let i = 0; i < bill.products.length; i++) {
      const prod = bill.products[i];
      const imgUrl = prod.pic;
      const base64Img = await getBase64Image(imgUrl);
      if (base64Img) imageMap[i] = base64Img;

      rows.push([
        "", // leave image cell empty for now
        prod.pname,
        prod.qty,
        prod.price.toFixed(2),
        prod.subtotal.toFixed(2),
      ]);
    }

    // Draw table
    doc.autoTable({
      head: [["Image", "Product", "Qty", "Price", "Subtotal"]],
      body: rows,
      startY: yPos,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 3, minCellHeight: 14 },
      didDrawCell: (data) => {
  // Draw image inside first column cell, only for body rows (skip header)
  if (
    data.section === "body" && // ✅ ensure it's not header
    data.column.index === 0 &&
    imageMap[data.row.index]
  ) {
    const base64Img = imageMap[data.row.index];
    doc.addImage(base64Img, "JPEG", data.cell.x + 2, data.cell.y + 2, 10, 10);
  }
},
    });

    yPos = doc.lastAutoTable.finalY + 5;
    doc.setFontSize(12);
    //doc.text(`Total: ₹${bill.total.toFixed(2)}`, 130, yPos);
   doc.text(`Total: ${bill.total.toFixed(2)}`, 142, yPos);
   //doc.text(`Total: ₹${bill.total.toFixed(2)}`, 130, yPos);
    yPos += 10;
  }

  // Grand Total
  doc.setFontSize(14);
  doc.setTextColor(0, 100, 0);
  doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 110, yPos + 5);
//doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 110, yPos + 5);
  doc.save("CustomerBills.pdf");
  } catch (err) {
    console.error(err);
    alert("Error generating PDF");
  } finally {
    setLoadingPDF(false); // hide spinner/text
  }
};

  return (
    <div>
      <center>
        <h2>Bill List (Admin View)</h2>
        <table>
          <tbody>
            <tr>
              <td>Customer:</td>
              <td>
                <select onChange={handleCustomerSelect}>
                  <option value="">-- Select Customer --</option>
                  {custlist.map((item) => (
                    <option key={item.Cid} value={item.Cid}>
                      {item.CustomerName} ({item.Cid})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {billdetailslist.length > 0 ? (
          <>
            <table border={1} cellPadding={6} style={{ marginTop: "20px" }}>
              <thead style={{ backgroundColor: "#ddd" }}>
                <tr>
                  <th>Bill Id</th>
                  <th>Customer Id</th>
                  <th>Bill Date</th>
                  <th>Product Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                  <th>Product Image</th>
                </tr>
              </thead>
              <tbody>
                {currentBills.map((bill) => (
                  <React.Fragment key={bill.billid}>
                    {bill.products.map((prod, idx) => (
                      <tr key={`${bill.billid}-${idx}`}>
                        <td>{idx === 0 ? bill.billid : ""}</td>
                        <td>{idx === 0 ? bill.cid : ""}</td>
                        <td>{idx === 0 ? bill.billdate : ""}</td>
                        <td>{prod.pname}</td>
                        <td>{prod.qty}</td>
                        <td>{prod.price.toFixed(2)}</td>
                        <td>{prod.subtotal.toFixed(2)}</td>
                        <td>
                          <img
                            src={prod.pic}
                            height="80"
                            width="80"
                            alt={prod.pname}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* ✅ Per-Bill Total */}
                    <tr
                      style={{
                        backgroundColor: "#fff8dc",
                        fontWeight: "bold",
                      }}
                    >
                      <td colSpan="6"></td>
                      <td
                        style={{
                          borderTop: "2px solid #888",
                          color: "green",
                          textAlign: "center",
                        }}
                      >
                        Total: ₹{bill.total.toFixed(2)}
                      </td>
                      <td></td>
                    </tr>
                  </React.Fragment>
                ))}

                {/* ✅ Grand Total */}
                <tr
                  style={{
                    backgroundColor: "#e6ffe6",
                    fontWeight: "bold",
                    fontSize: "16px",
                  }}
                >
                  <td colSpan="6"></td>
                  <td
                    style={{
                      borderTop: "3px double #000",
                      textAlign: "center",
                      color: "darkgreen",
                    }}
                  >
                    Grand Total: ₹{grandTotal.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>

            {/* ✅ PDF Button */}
         <button
  onClick={downloadPDF}
  disabled={loadingPDF}
  style={{
    marginTop: "20px",
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 25px",
    border: "none",
    borderRadius: "5px",
    cursor: loadingPDF ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "16px",
  }}
>
  {loadingPDF && (
    <span
      style={{
        border: "3px solid #f3f3f3", // light gray
        borderTop: "3px solid #00aaff", // bright blue
        borderRadius: "50%",
        width: "20px",
        height: "20px",
        display: "inline-block",
        marginRight: "10px",
        animation: "spin 1s linear infinite",
      }}
    ></span>
  )}
  {loadingPDF ? "Generating PDF..." : "Download PDF"}

  {/* Keyframes inline for spinner */}
  <style>
    {`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}
  </style>
</button>


          </>
        ) : (
          <p style={{ marginTop: "20px", color: "gray" }}>
            No bills to display.
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ marginTop: "20px" }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>
            <span style={{ margin: "0 10px" }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </center>
    </div>
  );
}

export default ShowBills;
