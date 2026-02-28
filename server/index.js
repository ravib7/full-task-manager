const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { adminProtect } = require("./middlewares/auth.middlewares.js")
require("dotenv").config()

const app = express()

mongoose.connect(process.env.MONGO_URL)

app.use(express.json())

app.use(cookieParser())

app.use("/api/auth", require("./routes/auth.routes.js"))
app.use("/api/admin", adminProtect, require("./routes/admin.routes.js"))

app.use("/", (req, res) => {
    res.status(404).json({ message: `Resource not found ${req.method} ${req.path}` })
})

mongoose.connection.once("open", () => {
    console.log("db connected")
    app.listen(process.env.PORT, () => {
        console.log("server running")
        console.log(`node: ${process.env.NODE_ENV}`)
    })
})

module.exports = app