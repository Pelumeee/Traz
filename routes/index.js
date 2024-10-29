const express = require("express");
const router = express.Router();


router.get("/", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("index", { title: "Home", currentRoute });
});



module.exports = router;
