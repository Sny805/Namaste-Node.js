const socket = require("socket.io")
const crypto = require("crypto")
const Chat = require("../models/chat")
const ConnectionRequest = require("../models/connectionRequest")


const getSecretRoomId = (userId, targetUserId) => {
    return crypto.createHash("sha256").update([userId, targetUserId].sort().join("_")).digest("hex")
}

const initializeSocket = (server) => {

    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })

    io.on("connection", (socket) => {

        socket.on("joinChat", ({ firstName, targetUserId, userId }) => {
            const roomId = getSecretRoomId(userId, targetUserId)

            socket.join(roomId)
        });

        socket.on("sendMessage", async ({
            firstName,
            lastName,
            userId,
            targetUserId,
            text
        }) => {
            try {
                const roomId = getSecretRoomId(userId, targetUserId)
                // check if userId and targetUserId are friends

                const connection = await ConnectionRequest.findOne({
                    status: "accepted",
                    $or: [{
                        fromUserId: userId, toUserId: targetUserId
                    },
                    {
                        fromUserId: targetUserId, toUserId: userId
                    }]
                })

                if (!connection) {
                    return res.status(500).json({ message: "connections are required" })
                }

                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text
                })

                await chat.save()
                io.to(roomId).emit("messageReceived", { firstName, text, lastName })

            }
            catch (err) {
                console.log(err);
            }
        });
        socket.on("disconnect", () => {
        });
    })
    // handle event 



}

module.exports = initializeSocket