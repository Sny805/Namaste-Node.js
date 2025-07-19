const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt")
const { validateSingleData } = require("./utills/validation")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")

app.use(express.json())
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
    try {
        const { password, emailId } = req.body

        if (!emailId || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        const user = await User.findOne({ emailId })
        if (!user) {
            throw new Error("Invalid Credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = await jwt.sign({ _id: user._id }, "DEVTinder$790");

            res.cookie("token", token);
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

app.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user
        res.send(user)

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }



})

app.get("/user", async (req, res) => {
    try {
        const userEmail = req.body.emailId
        const user = await User.findOne({ emailId: userEmail })
        if (!user) {
            res.status(404).send("User not found")
        }
        else {
            res.send(user)
        }

    }
    catch (err) {
        res.status(404).send("something went wrong")
    }

})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length == 0) {
            res.status(404).send("Users not found")
        }
        else {
            res.send(users)
        }
    }
    catch (err) {
        res.status(404).send("something went wrong")
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully");
    }
    catch (err) {
        res.status(404).send("something went wrong")
    }
})

app.patch("/user/:userId", async (req, res) => {
    const userId = req.params.userId
    const data = req.body

    const UPDATE_ALLOWED = ["photoUrl", "about", "gender", "age", "skills"]

    const isUpdatedAllowed = Object.keys(data).every((v) => UPDATE_ALLOWED.includes(v));

    if (!isUpdatedAllowed) {
        throw new Error("Update not allowed")
    }

    if (data.skills.length > 10) {
        throw new Error("Skills should never be greater 10")
    }

    try {
        await User.findByIdAndUpdate(userId, data, { runValidators: true })
        res.send("user updated successfully");
    }
    catch (err) {
        res.status(404).send("UPDATE FAILED", err.message)
    }

})

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
    })
}).catch((err) => {
    console.error("Database cannot be connected");
})

