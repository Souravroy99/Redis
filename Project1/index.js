import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectDB from "./lib/db.js"
import User from "./model/user.model.js"

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(201).json({message: "Hello from Redis Project_1"})
})

app.get('/get', async (req, res) => {
    const user = await User.find()
    return res.status(200).json(user)
})

app.post('/create', async (req, res) => {
    const {name, email, password} = req.body

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