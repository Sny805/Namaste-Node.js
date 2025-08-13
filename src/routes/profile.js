const express = require("express")
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth")

const { validateEditProfileData } = require("../utills/validation")



profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {

        const user = req.user
        res.status(200).json(user)

    }
    catch (err) {

        res.status(400).json({ error: err.message })
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request")
        }

        const loggedInUser = req.user
        Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.status(200).json({ message: `Profile updated`, data: loggedInUser });

    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})


module.exports = profileRouter