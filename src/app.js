const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = User(req.body);
    try {
        await user.save();
        res.send("User Added successfully");
    }
    catch (err) {
        res.status(400).send("Error saving the user", err);
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
        console.log("Server is successfully listening on port 3000...");
    })
}).catch((err) => {
    console.error("Database cannot be connected");
})

