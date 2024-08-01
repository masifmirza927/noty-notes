const express = require('express');
const router = express.Router();
const { loginUser, registerUser, updateProfile } = require('../controllers/UserController');
const multer = require('multer');
const AuthCheck = require("../middlewares/Auth.middleware.js");

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

router.post("/login", loginUser);
router.post('/register', registerUser);

// uploading files in node js
router.put("/update-profile", [AuthCheck, upload.single('image')], updateProfile);



module.exports = router;