const validator = require("validator")


const validateSingleData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;

    if (!firstName || typeof firstName !== "string" || firstName.trim().length < 2) {
        throw new Error("firstName atleast 2 characters long ")
    }
    if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
        throw new Error("lastName must be 2 characters long")
    }

    else if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("A valid email address is required")
    }
    else if (!password || !validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error("Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol");
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "gender", "skills", "about", "photoUrl", "age"]

    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field));

    return isEditAllowed;
}

module.exports = { validateSingleData, validateEditProfileData }