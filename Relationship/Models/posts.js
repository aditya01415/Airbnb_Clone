const mongoose = require("mongoose");
const Schema = mongoose.Schema;

Main().then(()=>console.log("connected to database")).catch(err=>console.log(err));

async function Main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/relationDemo');
}

const userSchema = new Schema({
    username : String,
    email : String,
});

const postSchema = new Schema({
    username :String,
    likes : Number,
    user: {
            type :Schema.Types.ObjectId,
            ref:"User"
    }

    
});

const User =mongoose.model("User",userSchema);
const Post = mongoose.model("Post",postSchema);

const addData = async () => {
    let user = await User.findOne({username : "rahulkumar"});

    let post2 = new Post({
        content : "Hello World",
        likes : 7,
    });
    post2.user = user;
    await post2.save();
    
};

addData();