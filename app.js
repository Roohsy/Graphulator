import express from "express";
import { Storage } from "@google-cloud/storage";
import { Firestore } from "@google-cloud/firestore";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.json());

// initialize Google Cloud Storage and Firestore
const storage = new Storage();
const firestore = new Firestore();
// project bucket name
const bucketName = "gs://graphulator/"; 
// the cloud function url
const GENERATE_GRAPH_FUNCTION_URL = "https://us-central1-graphulator.cloudfunctions.net/generateGraph";

// get the HTML file from cloud storage
app.get("/", async (req, res) => {
  try {
      const file = storage.bucket(bucketName).file("Graphulator.html");
      const [contents] = await file.download();
      res.set("Content-Type", "text/html");
      res.send(contents.toString());
  } catch (error) {
      console.error("Error loading HTML file:", error);
      res.status(500).send("Error loading HTML file.");
  }
});

// generate graph
app.post("/api/generate-graph", async (req, res) => {
  try {
      const response = await fetch(GENERATE_GRAPH_FUNCTION_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
      });

      if (!response.ok) {
          throw new Error(`Cloud Function Error: ${response.statusText}`);
      }

      const result = await response.json();
      res.json(result);
  } catch (error) {
      console.error("Error in /api/generate-graph:", error);
      res.status(500).json({ error: "Failed to generate graph" });
  }
});

// load graphs data
app.get("/api/load-graphs", async (req, res) => {
  try {
      const snapshot = await firestore.collection("graphs").get();
      const graphs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(graphs);
  } catch (error) {
      res.status(500).json({ error: "Error loading graphs", details: error.message });
  }
});

// start the service
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
