const express = require("express")
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")



profileRouter.get("/profile", userAuth, async (req, res) => {
    try {

        const user = req.user
        res.send(user)

    }
    catch (err) {
        console.log("getting user profile")
        res.status(400).json({ error: err.message })
    }
})


module.exports = profileRouter