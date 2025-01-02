const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');

const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://bistro-boss-restaurant-5.web.app/',
        'https://bistro-boss-restaurant-5.firebaseapp.com',
    ],
    credentials: true
}))
app.use(express.json())


const uri = `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@tariqul-islam.mchvj.mongodb.net/?retryWrites=true&w=majority&appName=TARIQUL-ISLAM`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        // await client.db("admin").command({ ping: 1 });
        console.log("☘️  You successfully connected to MongoDB!");

        // Database Collection
        const menuCollection = client.db("Bistro_Boss").collection("Menu")
        const reviewCollection = client.db("Bistro_Boss").collection("Reviews")
        const cartCollection = client.db("Bistro_Boss").collection("Cart")

        app.get('/menus', async (req, res) => {
            try {
                const result = await menuCollection.find().toArray()
                res.send(result)
            } catch (error) {
                console.log("Menu Error:", error.message);
                res.status(500).send({ message: error.message })
            }
        })

        app.get('/reviews', async (req, res) => {
            try {
                const result = await reviewCollection.find().toArray()
                res.send(result)
            } catch (error) {
                console.log("Review Error:", error.message);
                res.status(500).send({ message: error.message })
            }
        })

        app.post('/carts', async (req, res) => {
            try {
                const cart = req.body
                const email = cart?.buyer?.email
                const productId = cart?.productId

                const isExist = await cartCollection.findOne({ 'buyer.email': email, productId: productId })

                if (isExist) {
                    return res.status(400).send('Product Already Added to Cart')
                }

                const result = await cartCollection.insertOne(cart)
                res.send(result)
            } catch (error) {
                console.log("Cart Error:", error.message);
                res.status(500).send({ message: error.message })
            }
        })

        app.get('/carts', async (req, res) => {
            try {
                const email = req.query.email
                console.log(email);
                const result = await cartCollection.find({ 'buyer.email': email }).toArray()
                res.send(result)
            } catch (error) {
                console.log("Cart Error:", error.message);
                res.status(500).send({ message: error.message })
            }
        })

    } catch (error) {
        console.log("MongoDB:", error.message);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Programmer. How Are You? This Server For Bistro Boss Restaurant Website ❤️')
})

app.listen(port, () => {
    console.log(`☘️  You successfully connected to Server: ${port}`);
})