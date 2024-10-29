const express = require("express");
const router = express.Router();


router.get("/profile", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("profile", { title: "Profile", currentRoute });
});
router.get("/our-team", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("team", { title: "Our-Team", currentRoute });
});



module.exports = router;
