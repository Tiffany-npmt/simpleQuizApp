const express = require("express");
const router = express.Router();
const axios = require("axios");
const jwt = require("jsonwebtoken");

const API = process.env.BASE_URL + "/api";

router.get("/login", (req, res) => {
    res.render("auth/login");
});

router.get("/register", (req, res) => {
    res.render("auth/register");
});

router.post("/login", async (req, res) => {

    try {

        const response = await axios.post(`${API}/auth/login`, req.body);

        const token = response.data.token;
        const decoded = jwt.decode(token);

        req.session.token = token;
        req.session.user = {
            username: req.body.username,
            admin: decoded.admin
        };

        res.redirect("/quizzes");

    } catch (error) {
        console.log(error.response?.data || error.message);
        res.send("Login failed");

    }
});

router.post("/register", async (req, res) => {

    try {

        await axios.post(
            `${API}/auth/register`,
            req.body
        );

        res.redirect("/login");

    } catch (error) {

        res.send("Register failed");

    }

});

router.get("/logout", (req, res) => {

    req.session.destroy();

    res.redirect("/login");

});

module.exports = router;