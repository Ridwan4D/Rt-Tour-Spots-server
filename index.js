const express = require('express');
const cors = require('cors');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yyjvuyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const spotsCollection = client.db("touristSpotDB").collection("spots");
        const countryCollection = client.db("touristSpotDB").collection("countryCollection");

        

        // spots related apis
        app.get("/allPlace", async (req, res) => {
            const cursor = spotsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/allPlace/:id", async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await spotsCollection.findOne(query);
            // console.log(result);
            res.send(result)
        })


        app.get("/myList/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await spotsCollection.find({ userEmail: req.params.email }).toArray()
            console.log(result);
            res.send(result)
        })


        app.post("/addSpots", async (req, res) => {
            const spotInfo = req.body;
            const result = await spotsCollection.insertOne(spotInfo);
            res.send(result);
        })


        app.put("/addSpots/:id", async (req, res) => {
            const id = req.params.id;
            const updatedSpot = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateSpot = {
                $set: {
                    image: updatedSpot.image,
                    spot: updatedSpot.spot,
                    country: updatedSpot.country,
                    location: updatedSpot.location,
                    cost: updatedSpot.cost,
                    season: updatedSpot.season,
                    travelTime: updatedSpot.travelTime,
                    perYearVisitor: updatedSpot.perYearVisitor,
                    userName: updatedSpot.userName,
                    userEmail: updatedSpot.userEmail,
                    description: updatedSpot.description,
                },
            };
            const result = await spotsCollection.updateOne(filter, updateSpot, options);
            res.send(result);
        })

        app.delete("/myList/:id", async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await spotsCollection.deleteOne(query)
            res.send(result);
        })





        // user related apis
        // app.get('/users/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log("please show the id: ", id);
        //     const query = { _id: new ObjectId(id) }
        //     const user = await userCollection.findOne(query);
        //     res.send(user);
        // })

        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("tourist server is running")
})


app.listen(port, () => {
    console.log(`server is running from: ${port}`);
})