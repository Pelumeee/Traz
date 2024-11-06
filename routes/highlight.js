const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("highlight", { title: "Contact", currentRoute });
});

module.exports = router;
