const express = require("express");
const UserModel = require("./models/User.model");
const NoteModel = require("./models/Note.model");
const  mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const app = express();
const port = 3001;
const JWT_SECRET = "asdfa8765@@@vmnxclvnb3r2p9y29$%%^^78p34yh;skdfn;kxncvkabnsvlkbzxclk";



//middleware
app.use(express.json());
const AuthCheck = require("./middlewares/Auth.middleware.js");

app.get("/", (req, res) => {
    res.send("working...");
});

// register
app.post("/user/register", async (req, res) => {
    try {
        const { name, email, password, photo, gender } = req.body;

        // check user is already registered?
        const alreadyRegister = await UserModel.findOne({ email: email });
        if (alreadyRegister !== null) {
            return res.status(400).json({
                errors: true,
                message: "user already registered"
            })
        }


        // hash the password
        const hashed = await bcrypt.hash(password, saltRounds);

        // save user
        const user = await UserModel.create({ name: name, email: email, password: hashed, photo: photo, gender: gender });

        // generate jwt token

        // send success response
        res.status(201).json({
            errors: false,
            user: user,
            message: "User successfully registered."
        })


    } catch (error) {

    }
});

// login
app.post("/user/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user is registered or not
        const user = await UserModel.findOne({ email: email });
        if (user === null) {
            return res.status(400).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        // then check password is correct ?
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (isPassCorrect === false) {
            return res.status(400).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        //todo JWT token
        // we are generating jwt token for authentication, and giving it expiry of 1 hour.
        const access_token = await jwt.sign({userId: user._id}, JWT_SECRET,  { expiresIn: '2h' });

        // send success response
        return res.status(200).json({
            errors: false,
            message: "successfully logged in",
            accessToken: access_token
        });

    } catch (error) {

    }
});

app.get("/notes/me", async (req, res) => {
    try {
        const userId = "668ba4ee6febd2b4ff9c3970";
        const notes = await NoteModel.find().populate({
            path: "user",
            select: "name email"  // Include only name and email
        });
        return res.json({
            notes: notes
        })
    } catch (error) {
        console.log(error.message);
    }
});

// create a new note
app.post("/notes", AuthCheck,  async (req, res) => {
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
        await NoteModel.findByIdAndDelete(id);
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


// authenticate jwt token
app.post("/user/verify", async (req, res) => {
    try {
        const token = req.body.token;
        
        const token_verify = await jwt.verify(token, JWT_SECRET);
        console.log(token_verify);
        if(!token_verify) {
            console.log("not valid")
        } else {
            console.log("valid")
        }

    } catch (error) {
        console.log(error.message);
    }
})

mongoose.connect("mongodb://localhost:27017/notydb").then(() => {
    app.listen(port, () => console.log("server & db is up..."));
})

