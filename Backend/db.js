const mongoose = require('mongoose');

require('dotenv').config();

const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

const connectionString = `mongodb+srv://${db_username}:${db_password}@cluster0.u8qcu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

const connectToDB = async ()=>{
    try{
        await mongoose.connect(connectionString,connectionParams);
        console.log("Connected to MongDB");
    }
    catch(err){
        console.log("got this error message : " + err);
    }
}

module.exports = connectToDB;