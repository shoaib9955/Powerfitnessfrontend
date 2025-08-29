import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

const PORT = 4000;

app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
});
