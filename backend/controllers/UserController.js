const UserModel = require("../models/User.model");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const saltRounds = 10;
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});


const loginUser = async (req, res) => {
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
        const access_token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

        // send success response
        return res.status(200).json({
            errors: false,
            message: "successfully logged in",
            accessToken: access_token,
            user: { name: user.name, photo: user.photo, email: user.email }
        });

    } catch (error) {
        res.status(500).json({
            errors: true,
            message: "internal server error"
        })
    }
}

const registerUser = async (req, res) => {
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
}


const updateProfile = async (req, res) => {
    try {
        const name = req.body.name;
        const image = req.file.filename;
        const userId = req.userId;

        const cloudinaryImage = await cloudinary.uploader.upload(req.file.path);

        // find and update
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            name: name, photo: cloudinaryImage.url
        }, { new: true });

        const docWithGetters = updatedUser.toObject({ getters: true });

        return res.status(200).json({
            errors: false,
            user: docWithGetters,
            message: "successfully uploaded"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            errors: true,
            message: "internal server error"
        })
    }
}

module.exports = {
    loginUser,
    registerUser,
    updateProfile
}
