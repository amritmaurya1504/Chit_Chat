const User = require("../model/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    try {
        const { name, email, password, pic } = req.body;

        if (!name || !email || !password) {
            res.status(422).json({ error: "You did not provide any details for authentication!" })
        }


        const userExist = await User.findOne({ email: email });

        if (userExist) {
            res.status(422).json({ error: "User already exist!" })
        } else {
            const user = new User({ name, email, password, pic });
            await user.save();
            res.status(201).json({ message: "User register sucessfully!" });
        }

    } catch (error) {
        console.log(error);
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(422).json({ error: "You did not provide any details for authentication!" })
        }

        const userLogin = await User.findOne({ email: email });
        if (userLogin) {
            const isMatch = await bcrypt.compare(password, userLogin.password);
            if (!isMatch) {
                res.status(422).json({ error: "Invalid Credentials" });
            } else {
                userLogin.password = undefined;
                const token = jwt.sign({ _id: userLogin._id }, process.env.JWT_SECRET);
                res.status(201).json({ message: "User Login Sucessfully!", userLogin, token });
            }
        } else {
            res.status(422).json({ error: "User Does not Exist!" })
        }
    } catch (error) {
        res.json(error)
    }


}

const findEmail = async (req, res) => {
    const { email } = req.body;
    console.log(email);

    const isEmail = await User.findOne({ email: email });
    if (!isEmail) {
        res.status(422).json({ error: "Email Doesn't Exists!" })
    } else {
        res.status(200).json({ message: "Email Exists!" })
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password } = req.body;

        const isEmail = await User.findOne({ email: email });

        if (isEmail) {
            isEmail.password = password;

            const updatePass = await isEmail.save();
            res.status(201).json({ message: "Password Changed!" })
        } else {
            res.status(404).json({ error: "User not found" })
        }

    } catch (error) {

    }
}
// /api/user/all-user?search=amrit 
const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ]
        } : {}

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
}


module.exports = { register, login, findEmail, changePassword, allUsers };