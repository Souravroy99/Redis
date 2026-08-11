import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectDB from "./lib/db.js"
import User from "./model/user.model.js"
import Redis from "ioredis"

const app = express()

// Usage of redis
const redis = new Redis(process.env.REDIS_URL)


app.use(express.json())

// Without redis
app.get('/', (req, res) => {
    return res.status(201).json({message: "Hello from Redis Project_1"})
})

// With redis
app.get('/get-with-redis', async(req, res) => {

    const cached = await redis.get("user:all")

    if(cached) {
        const user = JSON.parse(cached) 
        return res.status(200).json(user) 
    }

    const user = await User.find()
    await redis.set("user:all", JSON.stringify(user))

    return res.status(200).json(user)
})


app.get('/get', async (req, res) => {
    const user = await User.find()
    return res.status(200).json(user)
})

app.post('/create', async (req, res) => {
    const {name, email, password} = req.body

    // Whenever we create new data, we need to clear the cached data.
    await redis.del("user:all")

    const user = await User.create({name, email, password})

    return res.status(201).json(user)
})



const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening at: ${PORT}`);
    })
})
.catch((err) => {
    console.log(err);
    process.exit(0)
})