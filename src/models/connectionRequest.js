const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",// reference to the user connection
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        }
    }
},
    {
        timestamps: true,
    }
)

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // if from userId is equal to toUserId or not
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("cannot send connection request to yourself!")
    }
    next();
})

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema)

module.exports = ConnectionRequest