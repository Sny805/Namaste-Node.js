const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json())
app.use(cookieParser());

const appRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", appRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)



// app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params.userId
//     const data = req.body

//     const UPDATE_ALLOWED = ["photoUrl", "about", "gender", "age", "skills"]

//     const isUpdatedAllowed = Object.keys(data).every((v) => UPDATE_ALLOWED.includes(v));

//     if (!isUpdatedAllowed) {
//         throw new Error("Update not allowed")
//     }

//     if (data.skills.length > 10) {
//         throw new Error("Skills should never be greater 10")
//     }

//     try {
//         await User.findByIdAndUpdate(userId, data, { runValidators: true })
//         res.send("user updated successfully");
//     }
//     catch (err) {
//         res.status(404).send("UPDATE FAILED", err.message)
//     }

// })

connectDB().then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
        console.log("Server is successfully listening on port 7777...");
    })
}).catch((err) => {
    console.error("Database cannot be connected");
})

