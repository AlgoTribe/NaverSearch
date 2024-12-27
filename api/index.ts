const express = require("express");
const axios = require("axios");
const app = express();

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/search-blog", async (req, res) => {
  const { query, display = 10, start = 1, sort = "sim" } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter 'query' is required." });
  }

  const url = "https://openapi.naver.com/v1/search/blog";
  const headers = {
    "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID,
    "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET,
  };

  try {
    const response = await axios.get(url, {
      params: { query, display, start, sort },
      headers,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  const server = app.listen(PORT, () =>
    console.log(`Server ready on port ${server.address().port}.`)
  );
}

module.exports = app;
