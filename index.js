const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dy7mgpm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// main run
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // toys information
    const toysCollection = client.db("allToys").collection("toys");
    app.get("/toys", async (req, res) => {
      const cursor = toysCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    //  6 car all  information
    const sportsCollection = client.db("sportsCar").collection("sports");
    const regularCarCollection = client.db("regular-car").collection("regular");
    const CarCollection = client.db("police-car").collection("cars");

    app.get("/sports", async (req, res) => {
      const cursor = sportsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/regular", async (req, res) => {
      const cursor = regularCarCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/cars", async (req, res) => {
      const cursor = CarCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Single Id 6 car information

    app.get("/sports/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { name: 1, picture: 1, price: 1, rating: 1 },
      };

      const result = await sportsCollection.findOne(query, options);
      res.send(result);
    });

    // regular
    app.get("/regular/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { name: 1, picture: 1, price: 1, rating: 1 },
      };

      const result = await regularCarCollection.findOne(query, options);
      res.send(result);
    });

    // car

    app.get("/cars/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { name: 1, picture: 1, price: 1, rating: 1 },
      };

      const result = await CarCollection.findOne(query, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("speedy rides server is running");
});

app.listen(port, () => {
  console.log(`speedy rides server running on port:  ${port}`);
});
