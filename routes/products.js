const express = require("express");
const router = express.Router();
const contentful = require("contentful");
const Joi = require("joi");

const contentfulClient = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_TOKEN,
});

const optingSchema = Joi.object({
    bookName: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    websiteUrl: Joi.string().uri().optional().allow(null, ""),
});
router.get("/", async (req, res, next) => {
    let currentRoute = req.originalUrl;
    res.render("product", { title: "Products", currentRoute });
});
router.get("/books", async (req, res, next) => {
    try {
        const response = await contentfulClient.getEntries({
            content_type: "books",
        });
        const entries = response.items;
        res.status(200).json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching content");
    }
});

router.post("/", async (req, res) => {
    try {
        const { error, value } = optingSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        if (error) {
            return res.status(400).json({
                status: false,
                errors: error.details.map((err) => err.message),
            });
        }

        const { bookName, email, websiteUrl, name } = value;

        const message = `
            <div style="max-width: 600px; margin: 50px auto; background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
                <h2 style="font-size: 24px; margin-bottom: 20px;">Client Opting Form Submission</h2>
                <div style="margin-bottom: 20px;">
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Hi, ${name} would like to purchase ${bookName}. Kindly reach out to them at the provided email: <a href=""> ${email}</a></p>
                </div>
            </div>
        `;

        const mailjet = require("node-mailjet").connect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);
        await mailjet.post("send", { version: "v3.1" }).request({
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
                    Subject: "Opting Form Submission",
                    TextPart: "TRAZ Intelligence and Security Solutions Limited",
                    HTMLPart: message,
                },
            ],
        });
        res.status(200).json({
            status: true,
            message: "Form submitted successfully!",
            data: { bookName, email, websiteUrl },
        });
    } catch (error) {
        if (error.isJoi) {
            return res.status(400).json({ status: false, message: error.details[0].message });
        }
        res.status(500).json({ status: false, message: "Internal Server Error" });
    }
});

module.exports = router;
