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

    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {
          seller: 1,
          toyName: 1,
          subCategory: 1,
          price: 1,
          availableQuantity: 1,
        },
      };

      const result = await toysCollection.findOne(query, options);
      res.send(result);
    });

    // toys booking
    // amra j booking krtese client theke oita aikhane server site a passe

    const bookingCollection = client.db("allToys").collection("bookings");

    // all toys
    // app.get("/bookings", async (req, res) => {
    //   const cursor = bookingCollection.find();
    //   const result = await cursor.toArray();
    //   res.send(result);
    // });

    // find booking using id from database
    app.get("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: {
          name: 1,
          sellerName: 1,
          pictureUrl: 1,
          email: 1,
          subCategory: 1,
          price: 1,
          rating: 1,
          quantity: 1,
          description: 1,
        },
      };

      const result = await bookingCollection.findOne(query, options);
      res.send(result);
    });

    // booking user email data will get from here
    app.get("/bookings", async (req, res) => {
      // console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    });

    // taking information from client and also send to the database
    app.post("/bookings", async (req, res) => {
      const booking = req.body;
      // console.log(booking);
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });

    //delete with specific id
    app.delete("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await bookingCollection.deleteOne(query);
      res.send(result);
    });

    // update with specific id
    app.put("/bookings/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedBooking = req.body;
      console.log(updatedBooking);
      const toyBooking = {
        $set: {
          price: updatedBooking.price,
          quantity: updatedBooking.quantity,
          description: updatedBooking.description,
        },
      };
      const result = await bookingCollection.updateOne(
        filter,
        toyBooking,
        options
      );
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
        projection: {
          name: 1,
          picture: 1,
          price: 1,
          rating: 1,
          description: 1,
        },
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
        projection: {
          name: 1,
          picture: 1,
          price: 1,
          rating: 1,
          description: 1,
        },
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
        projection: {
          name: 1,
          picture: 1,
          price: 1,
          rating: 1,
          description: 1,
        },
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
