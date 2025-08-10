const express = require("express")
const { validateSingleData } = require("../utills/validation")
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req, res) => {
    try {

        // validation of data
        validateSingleData(req);

        const { firstName, lastName, emailId, password } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ emailId })
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" })
        }
        // encrypt password
        const passwordhash = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, emailId,
            password: passwordhash
        });
        await user.save();
        return res.status(201).json({ message: "User Registered Successfully" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message || "Signup Failed" });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { password, emailId } = req.body

        if (!emailId || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // check user is existed or not 
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(401).json({ error: "Invalid Credentials" })
        }


        const isPasswordValid = await user.validatePassword(password);

        if (!isPasswordValid) {

            res.status(401).json({ error: "Invalid Password" });
        }
        const token = await user.getJWT();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // false for local
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            expires: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
        });
        return res.status(200).json({ message: "Login sucessful", user })

    }
    catch (err) {
        return res.status(400).json({ error: err.message || "Login Failed" })
    }
})

authRouter.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production"
    });
    return res.status(200).json({ message: "Logout Successful" })
})

module.exports = authRouter;