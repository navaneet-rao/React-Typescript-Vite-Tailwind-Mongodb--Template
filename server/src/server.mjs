import { MongoClient, ServerApiVersion } from "mongodb";
import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", async (req, res) => {
  // perform a database connection when server starts
  try {
    // Connect to the MongoDB database
    await client.connect();

    // Access the students collection
    const studentsCollection = client
      .db("students_db")
      .collection("student_collection");

    // Fetch all documents from the collection
    const data = await studentsCollection.find().toArray();
    console.log("Retrieved documents");
    // Send the documents as a response
    res.send(data);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
