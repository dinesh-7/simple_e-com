const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobile:{ type: String , required:true, maxlength: 10 },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, default: "customer" }, // customer, admin
},{
    timestamps: true ,
    collection : 'users'
});

userSchema.statics.register = async function (customerName, address, mobile, email, password, role) {

    if(!validator.isEmail(email)){
        throw new Error("Invalid Email");
    }
    if(!validator.isStrongPassword(password, {
        minLength: 8, minLowercase: 0, minUppercase: 0, minNumbers: 0, minSymbols: 0
    })){

        throw new Error("Password must contain at least 8 characters");
    }
    // if(!validator.isMobilePhone(mobile)){
    //     throw new Error("Invalid Mobile Number");
    // }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //const hashedPassword = await bcrypt.hash(password, 10); -> directly call genSalt inside hash

    try{
        const user = new this({ 
            customerName, 
            address, 
            mobile,
            email,
            password: hashedPassword,
            role
        });
        return await user.save();
    }
    catch(error){
        console.log("Got error in Registering the User "+ error);
    }
};

userSchema.statics.login = async function (email, password) {
    try{
        const user = await this.findOne({ email }); 
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }
        return user;

    }
    catch(error){
        console.log("Got error in Login the User "+ error);
    }
};

userSchema.statics.getUserInfo = async function (email) {
    try{
        return await this.findOne({ email });
    }
    catch(error){
        console.log("Got error in Getting the User Info "+ error);
    }
}   

const User = mongoose.model('User', userSchema);
module.exports = User;
