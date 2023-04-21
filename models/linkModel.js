const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    id: { type: String, default: "" },
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    activated: { type: Boolean, default: true },
    parent: { type: mongoose.Schema.ObjectId },
    interactions: { type: mongoose.Schema.Types.Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId }
});

module.exports = mongoose.model("link", linkSchema);