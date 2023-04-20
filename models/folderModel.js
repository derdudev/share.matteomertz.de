const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    subfolders: { type: Array },
    children: { type: Array }
});

module.exports = mongoose.model("folder", folderSchema);