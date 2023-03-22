require("dotenv").config()
const port = process.env.PORT

const express = require("express")
const cors = require("cors")
const path = require("path")
const app = express()

//config JSON and form data response
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//CORS
app.use(cors({credentials: true, origin: "http://localhost:3000"}))

//Upload directory
app.use("/uploads",express.static(path.join(__dirname, "/uploads")))

//BD connection
require("./config/db.js")

//routes
const router = require("./routes/Router.js")

app.use(router)

app.listen(port,()=>{
    console.log(`Servidor rodando na porta ${port}`)
})