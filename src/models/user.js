const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email address" + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        emun: {
            values: ["male", "female", "other"],
            message: `{VALUE} is not a valid gender type`
        },
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/045/944/199/non_2x/male-default-placeholder-avatar-profile-gray-picture-isolated-on-background-man-silhouette-picture-for-user-profile-in-social-media-forum-chat-greyscale-illustration-vector.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("invalid Photo URL" + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is default value of user"
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    membershipType: {
        type: String,

    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "DEVTinder$790", { expiresIn: "1d" });
    return token
}


userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordhash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordhash)
    return isPasswordValid
}

const User = mongoose.model("User", userSchema);

module.exports = User