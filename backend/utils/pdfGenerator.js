// utils/pdfGenerator.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

/**
 * Generates a PDF receipt that matches the frontend React receipt
 * @param {Object} member - Member object from DB
 * @returns {Buffer} - PDF buffer
 */
const generateStyledReceiptPDF = async (member) => {
  let browser;

  try {
    // Load logo as Base64 (safe fallback)
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoData = fs.existsSync(logoPath)
      ? fs.readFileSync(logoPath).toString("base64")
      : "";

    const html = `
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@700;800;900&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 0; 
              margin: 0; 
              background-color: #f8fafc;
              color: #0f172a;
              -webkit-print-color-adjust: exact;
            }
            .container {
              max-width: 650px;
              margin: 30px auto;
              background: white;
              border-radius: 32px;
              overflow: hidden;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
              border: 1px solid #e2e8f0;
            }
            .top-bar {
              height: 8px;
              background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            }
            .header { 
              text-align: center; 
              padding: 40px 40px 10px;
            }
            .logo-bg {
              width: 80px;
              height: 80px;
              background: #f1f5f9;
              border-radius: 24px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 20px;
              border: 1px solid #f1f5f9;
            }
            .logo-bg img {
              width: 50px;
              height: 50px;
              object-fit: contain;
            }
            h1 { 
              font-family: 'Outfit', sans-serif;
              margin: 0; 
              font-size: 32px; 
              font-weight: 900; 
              text-transform: uppercase; 
              letter-spacing: -0.025em;
              color: #0f172a;
            }
            .brand-line {
              color: #4f46e5;
              font-weight: 700;
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              margin-top: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
            }
            .receipt-ref {
              font-size: 9px;
              color: #64748b;
              font-weight: 700;
              text-transform: uppercase;
              margin-top: 12px;
              background: #f1f5f9;
              display: inline-block;
              padding: 4px 12px;
              border-radius: 100px;
              letter-spacing: 0.05em;
            }
            .content {
              padding: 30px 40px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              padding: 24px 0;
              border-top: 1px solid #f1f5f9;
              border-bottom: 1px solid #f1f5f9;
              margin-bottom: 30px;
            }
            .label {
              font-size: 9px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              display: block;
              margin-bottom: 4px;
            }
            .value {
              font-size: 14px;
              font-weight: 600;
              color: #334155;
            }
            .value.highlight {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
            }
            
            .stat-title {
              font-size: 10px;
              font-weight: 800;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              margin-bottom: 16px;
            }
            .price-row {
              display: flex;
              justify-content: space-between;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .total-bar {
              margin-top: 30px;
              padding: 24px;
              background: #0f172a;
              color: white;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-radius: 20px;
            }
            .total-label {
              font-size: 9px;
              font-weight: 700;
              color: #94a3b8;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              margin-bottom: 4px;
              display: block;
            }
            .total-amount {
              font-size: 32px;
              font-weight: 900;
              letter-spacing: -0.05em;
            }
            .footer-legal {
              text-align: center;
              padding: 30px 40px 40px;
              font-size: 11px;
              color: #94a3b8;
              font-weight: 500;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="top-bar"></div>
            <div class="header">
              <div class="logo-bg">
                ${
                  logoData
                    ? `<img src="data:image/png;base64,${logoData}" />`
                    : ""
                }
              </div>
              <h1>Invoice Receipt</h1>
              <div class="brand-line">PowerFitness Elite</div>
              <div class="receipt-ref">Ref: #${member._id?.toString().slice(-8).toUpperCase()}</div>
            </div>

            <div class="content">
              <div class="info-grid">
                <div>
                  <span class="label">Member Details</span>
                  <span class="value highlight">${member.name}</span>
                </div>
                <div>
                  <span class="label">Account Status</span>
                  <span class="value" style="color: ${member.due > 0 ? "#e11d48" : "#059669"}">
                    ${member.due > 0 ? "Payment Pending" : "Full Access Granted"}
                  </span>
                </div>
                <div>
                  <span class="label">Phone Contact</span>
                  <span class="value">${member.phone}</span>
                </div>
                <div>
                  <span class="label">Registration Date</span>
                  <span class="value">${new Date(member.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span class="label">Membership Tier</span>
                  <span class="value">${member.duration} Month(s) Access</span>
                </div>
                <div>
                  <span class="label">Gender</span>
                  <span class="value">${member.sex || "Male"}</span>
                </div>
              </div>

              <div class="stat-title">Financial Statement</div>
              <div class="price-row">
                <span class="value" style="color: #64748b">Membership Fee</span>
                <span class="value" style="color: #0f172a; font-weight: 800">₹ ${member.amountPaid || 0}.00</span>
              </div>
              <div class="price-row">
                <span class="value" style="color: #64748b">Remaining Balance</span>
                <span class="value" style="color: ${member.due > 0 ? "#f43f5e" : "#10b981"}; font-weight: 700">
                  ${member.due > 0 ? `₹ ${member.due}.00` : "Cleared"}
                </span>
              </div>

              <div class="total-bar">
                <div>
                  <span class="total-label" style="color: #4f46e5">Next Renewal Date</span>
                  <span class="value" style="color: white; font-size: 16px">
                    ${member.expiryDate ? new Date(member.expiryDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div style="text-align: right">
                  <span class="total-label" style="color: #4f46e5; text-align: right">Final Amount Paid</span>
                  <div class="total-amount">₹ ${member.amountPaid}.00</div>
                </div>
              </div>
            </div>

            <div class="footer-legal">
              This document serves as an official proof of payment.<br/>
              Generated electronically. WWW.POWERFITNESS.COM
            </div>
          </div>
        </body>
      </html>
    `;

    // ✅ Launch Puppeteer with safe options (needed for serverless/containers)
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    return pdfBuffer;
  } catch (err) {
    console.error("❌ PDF generation error:", err);
    throw new Error("Failed to generate receipt PDF");
  } finally {
    if (browser) await browser.close();
  }
};
export default generateStyledReceiptPDF;
