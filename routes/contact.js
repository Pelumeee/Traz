const express = require("express");
const router = express.Router();
const axios = require("axios");
const { body, validationResult } = require("express-validator");
const Joi = require("joi");

const clientKey = process.env.GOOGLE_CLIENT_KEY;
const secretKey = process.env.GOOGLE_SECRET_KEY;

const contactSchema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    phone: Joi.string().trim().pattern(/^\d+$/).min(10).max(15),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(10).max(500).required(),
    "g-recaptcha-response": Joi.string().required(),
});

const sanitizeInput = [
    body("name").trim().escape(),
    body("phone").trim().escape(),
    body("email").trim().normalizeEmail(),
    body("message").trim().escape(),
    body("g-recaptcha-response").trim().escape(),
];

router.get("/", (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("contact", { title: "Contact", currentRoute, clientKey });
});

router.post("/", sanitizeInput, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { error, value } = contactSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json({ errors: errorMessages });
        }

        const message = `
            <div style="max-width: 600px; margin: 50px auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 24px; margin-bottom: 20px;">Client Details</h2>
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Name:</p>
                    <p style="font-size: 14px; color: #333; margin-top: 5px;">${value.name}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Email:</p>
                    <p style="font-size: 14px; color: #333; margin-top: 5px;">${value.email}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Phone:</p>
                    <p style="font-size: 14px; color: #333; margin-top: 5px;">${value.phone}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Message:</p>
                    <p style="font-size: 14px; color: #333; margin-top: 5px;">${value.message}</p>
                </div>
            </div>
        `;

        const params = {
            secret: secretKey,
            response: req.body["g-recaptcha-response"],
            remoteip: req.ip,
        };

        const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";

        const recaptchaResponse = await axios.post(verifyUrl, null, { params });

        if (!recaptchaResponse.data.success) {
            return res.status(400).json({
                status: false,
                message: "Failed reCAPTCHA verification",
            });
        }
        const mailjet = require("node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
        const request = mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: "Info@traz-intelligence-security.com",
                        Name: "TRAZ Intelligence and Security Solutions Limited",
                    },
                    To: [
                        {
                            Email: "Info@traz-intelligence-security.com",
                            Name: "TRAZ Intelligence and Security Solutions Limited",
                        },
                    ],
                    Subject: "Contact Form Submission",
                    TextPart: "TRAZ Intelligence and Security Solutions Limited",
                    HTMLPart: message,
                },
            ],
        });

        const result = await request;
        res.status(200).json({
            status: true,
            message: "Form submitted successfully!",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: `Error: ${err.message}`,
        });
    }
});



module.exports = router;
