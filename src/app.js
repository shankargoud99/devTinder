const express = require("express");

const app = express();

app.get("/getuserdata", (req, res) => {
    throw new Error("fjkdd");   // simulate error
    res.send("data sent");
});

// ✅ error handling middleware must be LAST
app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).send("Something went wrong");
});

app.listen(3000, () => {
    console.log("server is connected to 3000");
});
