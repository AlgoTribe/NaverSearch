const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
require("dotenv").config();

const app = express();

const API_KEY = process.env.NAVER_API_KEY;
const API_SECRET = process.env.NAVER_API_SECRET;
const CUSTOMER_ID = process.env.NAVER_CUSTOMER_ID;

function generateSignature(timestamp, method, uri) {
  const signatureString = `${timestamp}.${method}.${uri}`;
  return crypto.createHmac("sha256", API_SECRET).update(signatureString).digest("base64");
}

app.get("/", (req, res) => res.send("Naver Search Ads API Integration"));

app.get("/campaigns", async (req, res) => {
  const timestamp = Date.now().toString();
  const method = "GET";
  const uri = "/ncc/campaigns";
  const baseUrl = "https://api.naver.com";

  const signature = generateSignature(timestamp, method, uri);

  const headers = {
    "X-Timestamp": timestamp,
    "X-API-KEY": API_KEY,
    "X-Customer": CUSTOMER_ID,
    "X-Signature": signature,
  };

  try {
    const response = await axios.get(`${baseUrl}${uri}`, { headers });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
