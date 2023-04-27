const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    subfolders: { type: Array },
    owner: { type: mongoose.Schema.Types.ObjectId },
    parent: { type: mongoose.Schema.Types.ObjectId, default: null }
});

module.exports = mongoose.model("folder", folderSchema);