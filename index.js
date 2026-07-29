const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// CSS aur JS serve karega
app.use(express.static(__dirname));

// Home Page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "dashboard.html"));
});

// Server Start
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});