const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

require('dotenv').config()

const { MONGO_URI } = process.env;

const mongoose = require("mongoose");
const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

const auth = require("./auth");

mongoose.connect(
    MONGO_URI
);

/*
mongoose.connect(
    MONGO_URI
).then(async () => {
   const user = await User.create({
       name: "test",
       pw: await bcrypt.hash("test", 10),
       email: "matteo.mertz04@gmail.com",
   });
});
*/

app.use("/public", express.static(path.join(__dirname, "static")));
//app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", auth, (req, res)=>{
    if(req.user){
        res.sendFile(path.join(__dirname, "static", "mainservice.html"));
    } else {
        res.sendFile(path.join(__dirname, "static", "login.html"));
    }
});

app.post("/api/login", async (req, res) => {
    try {
        // Get user input
        const { userIdentifier, password } = req.body;

        // Validate user input
        if (!(userIdentifier && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        let user = await User.findOne({ email: userIdentifier });
        if(user == null){
            user = await User.findOne({ name: userIdentifier });
        }

        if (user && (await bcrypt.compare(password, user.pw))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, userIdentifier },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;
            console.log(user.token);

            // user
            res.cookie("mashareusr", user.token);
            res.status(200).json({
                jwt: user.token,
            });
            return;
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
    }
})

app.listen(8080);