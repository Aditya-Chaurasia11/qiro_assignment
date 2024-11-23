const express = require("express");
const { DuneClient } = require("@duneanalytics/client-sdk");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 5000;

const dune = new DuneClient("5qSI3LVnsVQFTBmuiUeq5dk01iNmv8nx");
app.use(cors());

app.get("/rwa-data", async (req, res) => {
  try {
    const response = await axios.get(
      "https://thingproxy.freeboard.io/fetch/https://app.rwa.xyz/_next/data/DlmxEZH0jjCJ13enSXh1I"
    );
    res.json(response.data); // Forward the data back to the client
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).send("Error fetching data from the API");
  }
});

app.get("/tvl-mapple", async (req, res) => {
  try {
    // 3420748
    // 2100857
    const queryId = 3114760;
    const queryResult = await dune.getLatestResult({ queryId });
    res.json(queryResult);
  } catch (error) {
    console.error("Error fetching query result:", error);
    res.status(500).json({ error: "Failed to fetch query result" });
  }
});

app.get("/tvl-centrifuge", async (req, res) => {
  try {
    // 3420748
    // 2100857
    const queryId = 2100857;
    const queryResult = await dune.getLatestResult({ queryId });
    res.json(queryResult);
  } catch (error) {
    console.error("Error fetching query result:", error);
    res.status(500).json({ error: "Failed to fetch query result" });
  }
});

app.get("/graph-mapple", async (req, res) => {
  try {
    // mapple = 3762580
    // clearpool = 4075095;
    // goldfinch=2690971
    // centrifuge
    // const queryId = 3420748;

    const queryId = 3762580;

    const queryResult = await dune.getLatestResult({ queryId });
    res.json(queryResult);
  } catch (error) {
    console.error("Error fetching query result:", error);
    res.status(500).json({ error: "Failed to fetch query result" });
  }
});

app.get("/graph-centrifuge", async (req, res) => {
  try {
    // mapple = 3762580
    // clearpool = 4075095;
    // goldfinch=2690971
    // centrifuge
    // const queryId = 3420748;

    const queryId = 3420748;

    const queryResult = await dune.getLatestResult({ queryId });
    res.json(queryResult);
  } catch (error) {
    console.error("Error fetching query result:", error);
    res.status(500).json({ error: "Failed to fetch query result" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
