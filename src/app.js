const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors")
require('dotenv').config()
require("./utills/cronjob");
const http = require("http")

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "https://devtinder-frontend-five.vercel.app"],
    credentials: true
},))

const appRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utills/socket");
const chatRouter = require("./routes/chat");

app.use("/", appRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)
app.use("/", paymentRouter)
app.use("/", chatRouter)

const server = http.createServer(app)
initializeSocket(server)

connectDB().then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
        console.log("Server is successfully listening on port 7777...");
    })
}).catch((err) => {
    console.error("Database cannot be connected");
})

