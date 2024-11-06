const express = require("express");
const router = express.Router();

const clientKey = process.env.GOOGLE_CLIENT_KEY;
const secretKey = process.env.GOOGLE_SECRET_KEY;

router.get("/", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("contact", { title: "Contact", currentRoute, clientKey });
});

router.post("/", (req, res) => {
    console.log(req.body);
});

module.exports = router;
