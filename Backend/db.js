const mongoose = require('mongoose');

const db_username = "aquaria";
const db_password = "<PUT your PAssword>"
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