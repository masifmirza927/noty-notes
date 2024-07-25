const express = require("express");
const app = express();
const UserModel = require("./models/User.model");
const NoteModel = require("./models/Note.model");
const  mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const port = 3001;
const multer  = require('multer');
const cors = require("cors");

require('dotenv').config();

// we are making uploads folder public
app.use(express.static('uploads'));


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = file.mimetype.split("/")[1];
      cb(null, file.fieldname + '-' + uniqueSuffix + "." + ext);
    }
  })
  
  const upload = multer({ storage: storage });


//middleware
app.use(express.json());
app.use(cors());

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
            return res.status(200).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        // then check password is correct ?
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if (isPassCorrect === false) {
            return res.status(200).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        //todo JWT token
        // we are generating jwt token for authentication, and giving it expiry of 1 hour.
        const access_token = await jwt.sign({userId: user._id}, process.env.JWT_SECRET,  { expiresIn: '30m' });

        // send success response
        return res.status(200).json({
            errors: false,
            message: "successfully logged in",
            accessToken: access_token,
            user: {name: user.name, photo: user.photo, email: user.email}
        });

    } catch (error) {
        res.status(500).json({
            errors: true,
            message: "internal server error"
        })
    }
});




app.get("/notes/me", AuthCheck,  async (req, res) => {
    try {
       // console.log(req.body.userId);
       const userId = new mongoose.Types.ObjectId(req.body.userId);
       
       const notes = await NoteModel.find({user: userId});

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
app.delete("/notes/:id",  async (req, res) => {
    try {
        const id = req.params.id;

        // todo check user is the owner of this note ?

        const note = await NoteModel.findByIdAndDelete(id);
        
        console.log( note.user.toString() )

        return;

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

        await NoteModel.findByIdAndUpdate(id, {isPinned: req.body.isPinned} );
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


// uploading files in node js
app.put("/update-profile", [AuthCheck, upload.single('image')], async (req, res) => {
    try {
        const name = req.body.name;
        const image = req.file.filename;
        const userId = req.userId;

        
        // find and update
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                name: name, photo: image
            }, {new: true})

        return res.status(200).json({
            errors: false,
            user: updatedUser,
            message: "successfully uploaded"
        })
    } catch (error) {
        return res.status(500).json({
            errors: true,
            message: "internal server error"
        })
    }
})



mongoose.connect("mongodb://localhost:27017/notydb").then(() => {
    app.listen(port, () => console.log("server & db is up..."));
})

