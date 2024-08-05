const express = require("express");
const app = express();
const NoteModel = require("./models/Note.model");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const port = 3001;

const cors = require("cors");
require('dotenv').config();

// importing routes
const userRoutes = require("./routes/user.routes.js");


// we are making uploads folder public
app.use(express.static('uploads'));


//middleware
app.use(express.json());
app.use(cors());
const AuthCheck = require("./middlewares/Auth.middleware.js");


app.get("/", (req, res) => {
    return res.send("hello world")
});

// routes
app.use("/user", userRoutes);


app.get("/notes/me/:type?", AuthCheck, async (req, res) => {
    try {
        const type = req.params.type;

        // console.log(req.body.userId);
        const userId = new mongoose.Types.ObjectId(req.body.userId);
        let query = { user: userId, isPinned: false, isArchived: false };

        if (type) {
            query[type] = true;
        }

        const notes = await NoteModel.find(query);

        // const notes = await NoteModel.find().populate({
        //     path: "user",
        //     select: "name email"  // Include only name and email
        // });
        return res.json({
            notes: notes
        })
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/notes/search", AuthCheck, async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const isPinned = req.query.isPinned;

        const userId = new mongoose.Types.ObjectId(req.body.userId);
        const searchObj = { user: userId, title: { $regex: new RegExp(searchQuery, 'i') } };

        if (isPinned) {
            searchObj['isPinned'] = true;
        }

        const notes = await NoteModel.find(searchObj);
        return res.json({
            errors: false,
            notes: notes
        })
    } catch (error) {

        console.log(error.message);
    }
});

// get all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await NoteModel.find();
        return res.status(201).json({
            errors: false,
            notes: notes
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: true
        })
    }
});

// create a new note
app.post("/notes", AuthCheck, async (req, res) => {
    try {

        const { title, content, userId } = req.body;

        //converting normal string id to mongodb object id
        const userIdObject = new mongoose.Types.ObjectId(userId);
        const newNote = await NoteModel.create({ title: title, content: content, user: userIdObject });

        return res.status(201).json({
            errors: false,
            message: "successfully created",
            note: newNote
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: true,
        })
    }
});


// update a note
app.put("/notes/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await NoteModel.findByIdAndUpdate(id, req.body);

        return res.status(200).json({
            errors: false,
            message: "successfully updated"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: true
        })
    }
});

// delete a note
app.delete("/notes/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // todo check user is the owner of this note ?

        const note = await NoteModel.findByIdAndDelete(id);

        //console.log( note.user.toString() )

        return res.status(200).json({
            errors: false,
            message: "successfully deleted"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: true
        })
    }
});


// update inPinned note
app.put("/notes/pinned/:id", AuthCheck, async (req, res) => {
    try {
        const id = req.params.id;

        await NoteModel.findByIdAndUpdate(id, { isPinned: req.body.isPinned });
        return res.status(200).json({
            errors: false,
            message: "successfully updated"
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: true
        })
    }
})

// authenticate jwt token
app.post("/user/verify", async (req, res) => {
    try {
        const token = req.body.token;
        await jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({
            errors: false
        });

    } catch (error) {
        return res.status(401).json({
            errors: true
        });

    }
});



mongoose.connect(process.env.MONGO_DB_URL).then(() => {
    app.listen(port, () => console.log("server & db is up..."));
});

// mongoose.connect("mongodb://localhost:27017/notydb").then(() => {
//     app.listen(port, () => console.log("server & db is up..."));
// })

