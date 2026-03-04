import { SMTPClient } from "emailjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const testEmail = async () => {
  console.log("🔍 Testing Email Configuration...");
  console.log("📧 User:", process.env.EMAIL_USER);
  console.log("🔒 Password:", process.env.EMAIL_PASS ? "********" : "MISSING");
  console.log("🌐 Host:", process.env.EMAIL_HOST || "smtp.gmail.com");

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === "your_email@gmail.com") {
    console.error("❌ ERROR: Email credentials are still placeholders in .env file.");
    process.exit(1);
  }

  const client = new SMTPClient({
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    ssl: process.env.EMAIL_SECURE === "true" || true,
  });

  try {
    console.log("⏳ Attempting to send test email...");
    await client.sendAsync({
      text: "PowerFitness Email Test Successful!",
      from: `"PowerFitness Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "Test Email from PowerFitness",
    });
    console.log("✅ SUCCESS: Test email sent to " + process.env.EMAIL_USER);
    process.exit(0);
  } catch (err) {
    console.error("❌ FAILED: Email sending error:");
    console.error(err);
    
    if (err.code === 4) {
      console.log("\n💡 TIP: If using Gmail, make sure you are using an 'App Password', NOT your regular account password.");
      console.log("🔗 Guide: https://support.google.com/accounts/answer/185833");
    }
    
    process.exit(1);
  }
};

testEmail();
