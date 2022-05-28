
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.thcmg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run () {

    try{

        await client.connect();
        const productCollection= client.db('xAutos').collection('product')
        const newProductCollection= client.db('xAutos').collection('newProduct')

        //GET
        app.get('/product', async(req, res)=>{
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products)
        })

        app.get('/product/:id', async (req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        })

        //POST
        app.post('/product', async(req, res)=>{
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result)
        })

        //PUT
        app.put('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const Updatedquantity = parseInt(req.body.quantity);
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    quantity: Updatedquantity
                }
            }

            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        //DELETE
        app.delete('/product/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result= await productCollection.deleteOne(query);
            res.send(result);

        });
    }
    finally{

    }
}

run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Crud is running')
});

app.listen(port, () =>{
    console.log('Crud is running', port)
})