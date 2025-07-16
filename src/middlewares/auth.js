const adminAuth = (req, res, next) => {
    console.log("authorizing token");
    const token = "xyz"
    const isAuthorized = token == "xyz";
    if (isAuthorized) {
        next()
    }
    else {
        res.status(401).send("Unauthorized");
    }
}

module.exports = { adminAuth }


