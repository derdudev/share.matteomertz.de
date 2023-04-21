const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");

require('dotenv').config()

const { MONGO_URI, INTERVAL_RANGE } = process.env;

const mongoose = require("mongoose");
const User = require("./models/userModel");
const Link = require("./models/linkModel");
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

// ### CRUD ###
app.post("/api/create", auth, async (req, res) => {
    if (req.user && validateCreate(req.body)) {
        let userId = new mongoose.Types.ObjectId(req.user.user_id);
        let linkId = randomId();
        console.log(linkId)
        while ((await Link.findOne({id: linkId})) != null){
            linkId = randomId();
        }

        let link = {
            title: req.body.title,
            link: req.body.link,
            parent: new mongoose.Types.ObjectId(req.body.parent),
            owner: userId,
            interactions: 0,
            activated: true,
            id: linkId
        }

        let insertedLink = await Link.create(link);

        res.json(insertedLink);
    } else {
        return res.status(403).send("A signed user token is required for authentication");
    }
});
const validateCreate = (body) => {
    return body.title != null && body.link != null && body.parent != null
}
const randomId = function(length = 6) {
    return Math.random().toString(36).substring(2, length+2);
};

app.get("/api/get", auth, async (req, res) => {
    if (!validateGetLinks(req.body)) return res.status(400).send("The received body was not sufficient");
    if (req.user) {
        let parentId = new mongoose.Types.ObjectId(req.body.folderId);
        let links = await Link.find({parent: parentId}).skip(req.body.interval * INTERVAL_RANGE).limit(INTERVAL_RANGE);
        return res.json(links);
    } else {
        return res.status(403).send("A signed user token is required for authentication");
    }
});
const validateGetLinks = (body) => {
    return body.folderId != null && body.interval != null;
}

// ### AUTHENTIFICATION ###

app.get("/", auth, (req, res)=>{
    console.log(req.user)
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
            res.cookie("mashareusrid", user._id);
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