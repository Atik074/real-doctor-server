const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000



// middleWare
app.use(cors())
app.use(express.json())


// real-doctor-mongose 
// AicEOPSUl0xlICUw



const uri = "mongodb+srv://real-doctor-mongose:AicEOPSUl0xlICUw@cluster0.flztkm6.mongodb.net/?retryWrites=true&w=majority";

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
    // Send a ping to confirm a successful connection

     const database = client.db('real-doctors')
     const doctorsCollection = database.collection('doctor') 

    //  customer order data
     const orderCollection = client.db('real-doctors').collection('order')


     app.post('/doctors' , async(req,res)=>{
      const doctorsDetails = req.body 
        console.log(doctorsDetails)
          const result =await doctorsCollection.insertOne(doctorsDetails)
           res.send(result)
         
     })

   
     app.get('/doctors' , async(req,res)=>{
       const cursor = doctorsCollection.find()
       const result = await cursor.toArray()
         res.send(result)
         
     })

     app.get('/doctors/:id', async(req,res)=>{
      const id = req.params.id 
       const query = {_id : new ObjectId(id)}
       const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { name:1, img:1 ,degree:1 , service:1,price:1 },
      };
  
        const result =await doctorsCollection.findOne(query , options)
           res.send(result)
     })

    //  customer order data create
    app.post('/orders' , async(req ,res)=>{
         const customerOrder = req.body 
         console.log(customerOrder)
         const result = await orderCollection.insertOne(customerOrder) 
         res.send(result)

    }) 
    // customer selected data
    app.get('/orders' , async(req ,res)=>{
      console.log(req.query) 
      let query = {} 
      if(req.query?.email){
         query = {email : req.query.email}
      }
     const result = await orderCollection.find(query).toArray() 
      res.send(result)

    })

// delete order from maongodb

    app.delete('/orders/:id' , async(req , res)=>{
      const id = req.params.id
      const query = { _id : new ObjectId(id)} 
      const result = await orderCollection.deleteOne(query)
      res.send(result)
    })

    // update order from mongodb 
    app.put('/orders/:id' , async(req ,res)=>{
      const id = req.params.id  
      const updateOrder = req.body
      const filter ={_id : new ObjectId(id)} 
      const options = {upsert : true} 
      const updateDoc ={
        $set :{
               status:updateOrder.status
 
        }
      }

      const result = await orderCollection.updateOne(filter , updateDoc,options)
      res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);











app.get('/', (req, res) => {
  res.send('Real doctor server running')
})

app.listen(port, () => {
  console.log(` app listening on port ${port}`)
})