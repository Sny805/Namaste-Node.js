const express = require("express")
const { userAuth } = require("../middlewares/auth")
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


const sendEmail = require("../utills/sendEmail")

// Constants
const ALLOWED_SEND_STATUSES = ["ignored", "interested"];
const ALLOWED_REVIEW_STATUSES = ["accepted", "rejected"];

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const { toUserId, status } = req.params;


        //  Don't allow sending request to self
        if (fromUserId.toString() === toUserId) {
            return res.status(400).json({ message: "You cannot send a request to yourself." });
        }

        if (!ALLOWED_SEND_STATUSES.includes(status)) {
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
        // const emailRes = await sendEmail.run()


        res.status(201).json({
            message: `${req.user.firstName} marked ${status} for ${toUser.firstName}.`,
            data
        })
    }

    catch (err) {
        res.status(500).json({ error: err.message })
    }
})



requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const toUserId = req.user._id;
        const { status, requestId } = req.params

        // Validate the status

        if (!ALLOWED_REVIEW_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Status not allowed!!" })
        }
        // Is Elon loggedIn user
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId,
            status: "interested"
        })

        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found" })
        }
        // status = interested
        connectionRequest.status = status
        const data = await connectionRequest.save();
        res.json({ message: `Connection request has been ${status}.`, data });
        // request id should be valid

    }
    catch (err) {
        res.status(500).json({ error: err.message })
    }

})


module.exports = requestRouter