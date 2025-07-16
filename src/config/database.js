const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://testing:ciZcZCNzRMEtxLgg@cluster0.prdim.mongodb.net/devTinder");
}


module.exports = connectDB



