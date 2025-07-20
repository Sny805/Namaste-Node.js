const express = require("express")
const { validateSingleData } = require("../utills/validation")
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt")


authRouter.post("/signup", async (req, res) => {
    try {
        // validation of data
        validateSingleData(req)
        const { firstName, lastName, emailId, password } = req.body
        // encrypt password
        const passwordhash = await bcrypt.hash(password, 10);
        const user = User({
            firstName, lastName, emailId,
            password: passwordhash
        });
        await user.save();
        res.send("User Added successfully");
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { password, emailId } = req.body

        if (!emailId || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            const token = await user.getJWT()
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000)
            });
            res.send("Login Successful!!!!")
        }
        else {
            throw new Error("Invalid Credentials")
        }

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.send("Logout Successfully");
})

module.exports = authRouter;