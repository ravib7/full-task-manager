const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
require("dotenv").config()

const app = express()

mongoose.connect(process.env.MONGO_URL)

app.use("/", (req, res) => [
    res.status(200).json({ message: `Task Manager Api Running in ${process.env.NODE_ENV} node` })
])

mongoose.connection.once("open", () => {
    console.log("db connected")
    app.listen(process.env.PORT, () => {
        console.log("server running")
        console.log(`node: ${process.env.NODE_ENV}`)
    })
})

module.exports = app