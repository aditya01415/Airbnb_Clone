const express = require('express');
const app = express();
const users = require('./routes/user.js');
const posts = require('./routes/post.js');
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

app.set('view engine', 'ejs');
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true
};

    app.use(session(sessionOptions));
    app.use(flash());

    app.use((req, res, next) => {
        res.locals.successMsg = req.flash("success");
        res.locals.errorMsg = req.flash("error");
        next();
    });

    app.get("/register", (req, res) => {
        let {name="Anonymous"} = req.query;
        req.session.name = name;
        if(name === "Anonymous"){
            req.flash("error",`Please provide a name.`);
        }
        else{
            req.flash("success",`User Successfully registered.`);
        }
        res.redirect("/hello");
    });

    app.get("/hello", (req, res) => {
        res.locals.successMsg = req.flash("success");
        res.locals.errorMsg = req.flash("error");
        res.render("page.ejs",{name:req.session.name});
    });

    // app.get("/reqcount", (req, res) => {
    //     if(req.session.count){
    //         req.session.count += 1;
    //     }else{
    //         req.session.count = 1;
    //     }
    //     res.send(`You have send a request ${req.session.count} times`);
    // });

    // app.get("/test", (req, res) => {
    //     res.send("test successful");
    // });

// app.use(cookieParser("thisismysecret"));

// app.get("/getsignedCookies", (req, res) => {
//     res.cookie("greet","namaste",{signed:true});
//     res.send("signedCookies sent");
// });

// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("signedCookies verified");
// });

// app.get("/getCookies", (req, res) => {
//     res.cookies("greet","namaste");
//     res.cookie("madeIn","India");
//     res.send("cookies have been set");
// });

// app.get("/", (req, res) => {
//     let {name="Anonymous"} = req.cookies;
//     console.dir(req.cookies);
//     res.send(`I am ${name}`);
// });

// app.use("/users",users);
// app.use("/posts",posts);

// app.get('/', (req, res) => {
//     res.send('Hi,I am root!');
// });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
