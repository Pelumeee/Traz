const express = require("express");
const router = express.Router();

router.get("/BOCE", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("boce", { title: "BOCE", currentRoute });
});
router.get("/ASF", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("asf", { title: "ASF", currentRoute });
});


module.exports = router;
