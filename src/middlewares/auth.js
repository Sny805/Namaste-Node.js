const jwt = require("jsonwebtoken");
const User = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token is not valid!!!!!")
        }

        const decodedToken = await jwt.verify(token, "DEVTinder$790");

        const { _id } = decodedToken

        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User does not exist")
        }

        req.user = user
        next()
    }
    catch (err) {
        console.log("getting user profile")
        res.status(400).json({ error: err.message })

    }

}

module.exports = { userAuth }


