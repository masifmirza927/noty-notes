
const mongoose = require("mongoose");

// creating schema
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

// model

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = NoteModel;