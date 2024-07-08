
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
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

// model

const NoteModel = mongoose.model("Note", noteSchema);

module.exports = NoteModel;