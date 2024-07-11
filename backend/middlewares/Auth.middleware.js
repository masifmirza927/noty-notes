const jwt = require("jsonwebtoken");
const JWT_SECRET = "asdfa8765@@@vmnxclvnb3r2p9y29$%%^^78p34yh;skdfn;kxncvkabnsvlkbzxclk";


const  AuthCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(token) {
            const decoded = await jwt.verify(token, JWT_SECRET);
            req.body.userId = decoded.userId;
            next();
        } else {
            // in the case of token not found
            return res.status(400).json({
                errors: true,
                message: "token not found"
            })
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            errors: true,
            message: "Authentication failed"
        })
    }
}

module.exports = AuthCheck;