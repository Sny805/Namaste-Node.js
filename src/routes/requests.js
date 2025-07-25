const express = require("express")
const { userAuth } = require("../middlewares/auth")
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"]
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status type " + status })
        }

        // user cant send request to itself


        // IF there is an existing connection request 
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {
                    fromUserId, toUserId
                },
                {
                    fromUserId: toUserId, toUserId: fromUserId
                }
            ]
        })
        if (existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request Already Exists!!" })
        }

        // If user exists or not 
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(400).json({ message: "User doest not exists" })
        }



        const connectionRequest = new ConnectionRequest({ fromUserId, toUserId, status })

        const data = await connectionRequest.save();

        res.json({
            message: req.user.firstName + " is " + status + " in " + toUser.firstName,
            data
        })
    }

    catch (err) {
        res.status(400).json({ error: err.message })
    }
})



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params

        // Validate the status
        const allowedStatus = ["accepted", "rejected"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!!" })
        }
        // Is Elon loggedIn user
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" })
        }
        // status = interested
        connectionRequest.status = status
        const data = await connectionRequest.save();
        res.json({ message: "Connection request " + status, data });
        // request id should be valid

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }

})


module.exports = requestRouter