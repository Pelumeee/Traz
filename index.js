let express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");

const port = 8080;

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



// ======== ROUTES =================================
const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const aboutRouter = require("./routes/about");
app.use("/about", aboutRouter);

const serviceRouter = require("./routes/services");
app.use("/services", serviceRouter);

const productRouter = require("./routes/products");
app.use("/products", productRouter);

const trainingRouter = require("./routes/training");
app.use("/training", trainingRouter);

const contactRouter = require("./routes/contact");
app.use("/contact", contactRouter);

// const highlightRouter = require("./routes/highlight");
// app.use("/highlights", highlightRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
