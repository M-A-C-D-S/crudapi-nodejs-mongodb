const mongoose = require("mongoose")
const dbUser = process.env.DB_USER //Usuário do banco de dados MongoDB
const dbPassword = process.env.DB_PASS //Senha do usuário MongoDB

const connection = async()=>{
    try {
        const dbConnection = await mongoose.connect(
            `mongodb+srv://${dbUser}:${dbPassword}@LINK` //Link do banco MongoDB
        )
        console.log("Conectado ao banco")
        return dbConnection
    } catch (error){
        console.log(error)
    }
}

connection()

module.exports = connection
