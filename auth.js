const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
    console.log(req.cookies);
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.mashareusr;

    if (!token) {
        res.user = null;
        //return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        res.user = null;
        //return res.status(401).send("Invalid Token");
    }
    return next();
};

module.exports = verifyToken;