const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    pw: { type: String, default: "" },
    email: { type: String, default: "" },
});

module.exports = mongoose.model("user", userSchema);