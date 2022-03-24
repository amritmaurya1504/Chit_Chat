const jwt = require("jsonwebtoken");

const User = require("../model/userModel.js");

const protect = async (req, res, next) => {

    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You Must be Logged in" });
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You Must be Loggeg in" })
        }

        const { _id } = payload;
        User.findById(_id).then(userData => {
            req.user = userData;
            // console.log(req.user);
            next();
        })
    })

}

module.exports = { protect }