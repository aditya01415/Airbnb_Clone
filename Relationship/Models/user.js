const mongoose = require("mongoose");
const Schema = mongoose.Schema;

Main().then(()=>console.log("connected to database")).catch(err=>console.log(err));

async function Main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}
const userSchema = new Schema({
    username: String,
    addresses: [{
        _id: false,
        location: String,
        city: String,
    }],
});

const User = mongoose.model("User", userSchema);


const addusers = async () => {
   let user1 = new User({
        username: "John Doe",
        addresses: [{
            location: "123 Main St",
            city: "New York",
        }]
    });
    user1.addresses.push({
        location: "456 Elm St",
        city: "Los Angeles",
    });
    await user1.save();
    console.log("User added:", user1);
};
addusers();
