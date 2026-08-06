const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"Sahil@8848",
    database:"my_task"
});

db.connect((error) =>{
    if(error){
        console.log("Database connection failed");
    }
    console.log("Database connection success");
})

module.exports = db;