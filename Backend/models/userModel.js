const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobile:{ type: String , required:true, maxlength: 10 },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "customer" }, // customer, admin
},{
    timestamps: true ,
    collection : 'users'
});

userSchema.statics.register = async function (customerName, address, mobile, email, password, role) {
    try{
        const user = new this({ 
            customerName, 
            address, 
            mobile,
            email,
            password,
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
        const user = await this.findOne({ email, password });
        if(!user){
            throw new Error("Invalid email or password");
        }
        return user;

    }
    catch(error){
        console.log("Got error in Login the User "+ error);
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;
