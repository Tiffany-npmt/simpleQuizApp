require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const session = require("express-session");

const quizRoutes = require("./routes/api/quizRoutes");
const questionRoutes = require("./routes/api/questionRoutes");
const authRoutes = require("./routes/api/authRoutes");
const userRoutes = require("./routes/api/userRoutes");

const webRoutes = require("./routes/pages/Web");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "quizsecret",
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
});

connectDB();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);

app.use("/", webRoutes);

const cors = require("cors");
app.use(cors());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});