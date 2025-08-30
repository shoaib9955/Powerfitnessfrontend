// utils/pdfGenerator.js
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

/**
 * Generates a PDF receipt that matches the frontend React receipt
 * @param {Object} member - Member object from DB
 * @returns {Buffer} - PDF buffer
 */
export const generateStyledReceiptPDF = async (member) => {
  // Load logo as Base64
  const logoPath = path.join(process.cwd(), "public", "logo.png");
  const logoData = fs.existsSync(logoPath)
    ? fs.readFileSync(logoPath).toString("base64")
    : "";

  const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; }
          .details { border: 1px solid #ddd; padding: 15px; border-radius: 10px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
          .paid { color: green; font-weight: bold; }
          .pending { color: red; font-weight: bold; }
          h2 { margin: 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="data:image/png;base64,${logoData}" width="100" />
          <h2>🧾 Payment Receipt</h2>
          <p>PowerFitness</p>
        </div>
        <div class="details">
          <div class="row"><span>Name:</span><span>${member.name}</span></div>
          <div class="row"><span>Phone:</span><span>${member.phone}</span></div>
          <div class="row"><span>Email:</span><span>${
            member.email || "-"
          }</span></div>
          <div class="row"><span>Sex:</span><span>${member.sex}</span></div>
          <div class="row"><span>Duration:</span><span>${
            member.duration
          }</span></div>
          <div class="row"><span>Amount Paid:</span><span>₹ ${
            member.amountPaid || 0
          }</span></div>
          <div class="row"><span>Due:</span>
            <span class="${member.due > 0 ? "pending" : "paid"}">₹ ${
    member.due || 0
  }</span>
          </div>
          <div class="row"><span>Joined:</span><span>${new Date(
            member.createdAt
          ).toLocaleDateString()}</span></div>
          <div class="row"><span>Expiry:</span><span>${new Date(
            member.expiryDate
          ).toLocaleDateString()}</span></div>
          <div class="row"><span>Status:</span>
            <span class="${member.due > 0 ? "pending" : "paid"}">${
    member.due > 0 ? "Pending" : "Paid"
  }</span>
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
  await browser.close();

  return pdfBuffer;
};
