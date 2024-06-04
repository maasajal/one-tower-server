const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 7000;

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://one1-tower.web.app",
    "https://one1-tower.firebaseapp.com",
  ],
};
// Middleware
app.use(express.json());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to One Tower!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jd9hrzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const stripe = require("stripe")(process.env.PAYMENT_SK);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const run = async () => {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // Collections from the database here
    const apartmentCollection = client.db("oneTower").collection("apartment");
    const userCollection = client.db("oneTower").collection("users");
    const agreementCollection = client.db("oneTower").collection("agreements");
    const announcementCollection = client
      .db("oneTower")
      .collection("announcements");
    const couponCollection = client.db("oneTower").collection("coupons");
    const paymentCollection = client.db("oneTower").collection("payments");

    //  Apartment data API
    app.get("/apartment", async (req, res) => {
      const result = await apartmentCollection.find().toArray();
      res.send(result);
    });

    // User related API
    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });
    app.patch("/users/member/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          role: "user",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });
    app.patch("/users/role/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const updatedDoc = {
        $set: {
          role: "member",
        },
      };
      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Agreement related API
    // app.get("/agreements", async (req, res) => {
    //   const agreements = req.body;
    //   const result = await agreementCollection.find(agreements).toArray();
    //   res.send(result);
    // });
    app.get("/agreements", async (req, res) => {
      const { status } = req.query;
      const filter = { status: status };
      const result = await agreementCollection.find(filter).toArray();
      res.send(result);
    });
    app.get("/agreements/:email", async (req, res) => {
      const email = req.params.email;
      const query = { user_email: email };
      const result = await agreementCollection.findOne(query);
      res.send(result);
    });
    app.post("/agreements", async (req, res) => {
      const agreement = req.body;
      const result = await agreementCollection.insertOne(agreement);
      res.send(result);
    });
    app.patch("/agreements/:id", async (req, res) => {
      const id = req.params.id;
      const { accepted_date } = req.body;
      const filter = { _id: new ObjectId(id) };
      const updatedDoc = {
        $set: {
          status: "checked",
          accepted_date,
        },
      };
      const result = await agreementCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    // Coupons API
    app.post("/coupons", async (req, res) => {
      const coupon = req.body;
      const result = await couponCollection.insertOne(coupon);
      res.send(result);
    });
    app.get("/coupons", async (req, res) => {
      const result = await couponCollection.find().toArray();
      res.send(result);
    });
    app.delete("/coupons/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await couponCollection.deleteOne(filter);
      res.send(result);
    });

    // Payment intend
    app.post("/create-payment-intent", async (req, res) => {
      const { rent } = req.body;
      const amount = parseInt(rent * 100);
      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentCollection.insertOne(payment);
      res.send(result);
    });
    app.get("/payment-histories/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    // Announcements by the owner API
    app.get("/announcements", async (req, res) => {
      const result = await announcementCollection.find().toArray();
      res.send(result);
    });
    app.post("/announcements", async (req, res) => {
      const announcements = req.body;
      const result = await announcementCollection.insertOne(announcements);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
};
run().catch(console.dir);

app.listen(port, () => {
  console.log(`One Tower server running on port ${port}!`);
});
