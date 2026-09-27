const mongoose = require("mongoose");
const Schema = mongoose.Schema;

Main().then(()=>console.log("connected to database")).catch(err=>console.log(err));

async function Main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

const orderSchema = new Schema({
    item: String,
    price: Number,
});

const customerSchema = new Schema({
    name: String,
    email: String,
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: "Order",
        },
    ],
});

customerSchema.post("findOneAndDelete", async function (customer) {
    if (customer.orders.length > 0) {
        let res = await order.deleteMany({ _id: { $in: customer.orders } });
        console.log("Deleted orders:", res);
    }
});

const order = mongoose.model("Order", orderSchema);
const customer = mongoose.model("Customer", customerSchema);

const findCustomer = async () => {
    let result = await customer.findOne({name: "Rahul Kumar"}).populate("orders");
    console.log(result);
}

// const addCustomer = async() => {
//     let cust1 = new customer({
//         name:"Rahul Kumar",
//     });
//     let order1 = await Order.findOne({item : "Laptop"});
//     let order2 = await Order.findOne({item : "Phone"});

//     cust1.orders.push(order1);
//     cust1.orders.push(order2);

//     let result = await cust1.save();
//     console.log(result);
// }

// const addOrders = async () => {
//     let orders = await order.insertMany([
//         {item: "Laptop", price: 1000},
//         {item: "Phone", price: 500},
//         {item: "Tablet", price: 300}
//     ]);
//     console.log("Orders added", orders);
// };

// addOrders()

const addCust = async() => {
    let newCust = new customer({
        name:"Karan Argun",
    });
    let newOrder = new order({
        item: "Headphones",
        price: 150
    });
    newCust.orders.push(newOrder);
    await newOrder.save();
    await newCust.save();
    console.log("Customer added");
};
const delCust = async() => {
    let data = await customer.findByIdAndDelete("6a75a6bacf8c903809626c20");
    console.log(data);
};

// addCust();
delCust();
    