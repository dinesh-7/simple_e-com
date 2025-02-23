const { kMaxLength } = require('buffer');
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    address: { type: String, required: true },
    mobile:{ type: String , required:true, maxlength: 10 },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number,
            total: Number
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" }, // Pending, Completed, Cancelled
},{
    timestamps: true ,
    collection : 'orders'
});

orderSchema.statics.placeOrder = async function (customerName, address,mobile, items, totalAmount) {
    try{
        const order = new this({ 
            customerName, 
            address, 
            mobile,
            items, 
            totalAmount 
        });
        return await order.save();
    }
    catch(error){
        console.log("Got error in Placing the Order "+ error);
    }
};

orderSchema.statics.getAllOrders = async function () {
    try{
        return await this.find().sort({ orderDate: -1 });
    }
    catch(error){
        console.log("Got error in Getting all the Orders " + error);
    }
};

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;