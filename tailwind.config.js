module.exports = {
    content: ["./views/**/*.ejs", "./public/**/*.html"],
    theme: {
        extend: {
            screens: {
                fd: [{ max: "320px" }],
                sm: "576px",
                md: "768px",
                lg: "992px",
                xl: "1200px",
                "2xl": "1400px",
            },
            colors: {
                gold: "#E7B952",
                blackBg: "#0C0C0C",
            },
        },
    },
    plugins: [],
};
