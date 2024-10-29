const express = require("express");
const router = express.Router();


router.get("/", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("services", { title: "Services", currentRoute });
});



module.exports = router;
