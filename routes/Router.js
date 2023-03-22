const express = require("express")
const router = express()

router.use("/users", require("./UserRoutes"))

router.get("/", (req,res)=>{
    res.send("Se você receber essa mensagem, a API está funcionando")
})

module.exports = router