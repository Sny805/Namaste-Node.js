const express = require("express");

const app = express();

// this will only handle GET call to /user
app.get('/user', (req, res) => {
    res.send({ firstName: "sunny", lastName: "kumar" })
});

app.post('/user', (req, res) => {
    res.send("data successfully saved to database")
});

app.delete('/user', (req, res) => {
    res.send("data successfully deleted from database")

});

//this will match all the HTTP method API calls to /test 
app.use("/test", (req, res) => {
    res.send("Hello from server")
})




app.listen(3000, () => {
    console.log("Server is successfully listening on port 3000...");
})