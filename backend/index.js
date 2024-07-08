const express = require("express");
const UserModel = require("./models/User.model");
const { default: mongoose } = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const port = 3001;


//middleware
app.use(express.json());

app.get("/", (req, res) => {
    res.send("working...");
});


// register
app.post("/user/register", async (req, res) => {
    try {
        const {name, email, password, photo, gender}  = req.body;

       // check user is already registered?
        const alreadyRegister = await UserModel.findOne({email: email});
        if(alreadyRegister !== null) {
           return res.status(400).json({
                errors: true,
                message: "user already registered"
            })
        }


       // hash the password
        const hashed = await bcrypt.hash(password, saltRounds);

       // save user
       const user = await UserModel.create({name: name, email: email, password: hashed, photo: photo, gender: gender });

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
        const {email, password} = req.body;

        // find user is registered or not
        const user = await UserModel.findOne({email: email});
        if(user === null) {
           return res.status(400).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        // then check password is correct ?
        const isPassCorrect = await bcrypt.compare(password, user.password);
        if(isPassCorrect === false) {
            return res.status(400).json({
                errors: true,
                message: "username or password is incorrect!"
            });
        }

        //todo JWT token

        // send success response
        return res.status(200).json({
            errors: false,
            message: "successfully logged in",
            accessToken: "token"
        });

    } catch (error) {
        
    }
})



app.get("/notes", async (req, res) => {
    try {

    } catch (error) {

    }
});



mongoose.connect("mongodb://localhost:27017/notydb").then( () => {
    app.listen(port, () => console.log("server & db is up..."));
})

