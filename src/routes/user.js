const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const userId = req.user._id

        const connectionRequests = await ConnectionRequest.find({
            toUserId: userId,
            status: "interested"
        }).populate("fromUserId", USER_SAFE_DATA).lean()

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        })



    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const userId = req.user._id
        const connectionRequests = await ConnectionRequest.find({
            status: "accepted",
            $or: [
                {
                    toUserId: userId,
                },
                {
                    fromUserId: userId
                }
            ]
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA).lean()


        const data = connectionRequests.map((row) =>
            row.fromUserId._id.toString() === userId.toString() ? row.toUserId : row.fromUserId
        );

        res.json({ data: data });
    }


    catch (err) {
        res.status(400).json({ error: err.message })
    }
})

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // 0. User should see all the user cards except
        // 0. His own card
        // 1. His connections cards
        // 2. ignored people
        // 3. already sent the connection request

        const userId = req.user._id
        const page = parseInt(req.query.page) || 1
        let limit = Math.min(parseInt(req.query.limit) || 10, 50)
        const skip = (page - 1) * limit
        //Find all the connection requests (sent+received)

        const connectionRequests = await ConnectionRequest.find({
            $or: [{ toUserId: userId }, { fromUserId: userId }]
        }).select("fromUserId toUserId").lean()

        const hideUsersFromFeed = new Set([userId.toString()]);

        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.toUserId.toString())
            hideUsersFromFeed.add(req.fromUserId.toString())
        })


        const users = await User.find({
            _id: { $nin: Array.from(hideUsersFromFeed) }
        }).select(USER_SAFE_DATA).skip(skip).limit(limit).lean()

        res.send(users)
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = userRouter