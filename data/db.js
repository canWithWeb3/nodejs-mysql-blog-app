const mysql = require("mysql2")
// const config = require("../config")
require("dotenv").config()

const Sequelize = require("sequelize")

const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
        timestamps: false
    },
    storage: "./session.mysql"
})

async function connect(){
    try{
        await sequelize.authenticate()
        console.log("mysql server bağlantısı yapıldı")
    }catch(err){
        console.log("Bağlantısı hatası", err)
    }
}

connect()

module.exports = sequelize

// let connection = mysql.createConnection(config.db)

// connection.connect(function(err) {
//     if(err){
//         return console.log(err)
//     }

//     console.log("mysql server bağlantısı yapıldı")
// })

// module.exports = connection.promise()

// // promise, async-await => async