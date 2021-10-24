const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2qgnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connected to database");
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");
    // get all data 
    app.get('/services',async(req,res)=>{
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services)
    })
    // create a document to insert
    // post api
    app.post("/services", async (req, res) => {
      // console.log('post hitted')
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      console.log(result)
      res.json(result)
    });

    // get single service 
    app.get('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await servicesCollection.findOne(query);
      res.json(result)
    })

    // delete api 
    app.delete('/services/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running my CRUD server");
});
app.listen(port, () => {
  console.log("Running server", port);
});
