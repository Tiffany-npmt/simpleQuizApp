const express = require("express");
const router = express.Router();
const axios = require("axios");

const API = "/api";

function requireLogin(req, res, next) {
    if (!req.session.token) {
        return res.redirect("/login");
    }
    next();
}

function authHeader(req) {
    return {
        headers: {
            Authorization: `Bearer ${req.session.token}`
        }
    };
}

router.use(requireLogin);

router.get("/questions", async (req, res) => {

    const keyword = req.query.keyword || "";
    const page = Number(req.query.page) || 1;

    const response = await axios.get(`${API}/questions`, {
        params: { keyword, page },
        ...authHeader(req)
    });

    const questions = response.data;

    res.render("question/list", {
        questions,
        keyword,
        page
    });
});


router.get("/questions/create", (req, res) => {
    res.render("question/create");
});

router.post("/questions/create", async (req, res) => {
    const { text, o1, o2, o3, correct, keywords } = req.body;

    await axios.post(`${API}/questions`, {
        text,
        options: [o1, o2, o3],
        correctAnswerIndex: Number(correct),
        keywords: keywords.split(",").map(k => k.trim())
    }, authHeader(req));

    res.redirect("/questions");
});

router.get("/questions/delete/:id", async (req, res) => {
    try {
        await axios.delete(`${API}/questions/${req.params.id}`, authHeader(req));
        res.redirect("/questions");
    } catch (error) {
        if (error.response && error.response.status === 403) {
            return res.send(`
                <script>
                alert("You are not author");
                window.location.href="/question";
                </script>`);
        }
        res.status(500).send(error.message);
    }
});

router.get("/questions/edit/:id", async (req, res) => {
    try {

        const q = await axios.get(
            `${API}/questions/${req.params.id}`,
            authHeader(req)
        );

        res.render("question/edit", { question: q.data });

    } catch (error) {

        if (error.response && error.response.status === 403) {
            return res.send(`
                <script>
                    alert("You are not author");
                    window.location.href = "/questions";
                </script>
            `);
        }

        res.status(500).send(error.message);
    }
});

router.post("/questions/edit/:id", async (req, res) => {
    try {

        const { text, o1, o2, o3, correct, keywords } = req.body;

        await axios.put(
            `${API}/questions/${req.params.id}`,
            {
                text,
                options: [o1, o2, o3],
                correctAnswerIndex: Number(correct),
                keywords: keywords.split(",").map(k => k.trim())
            },
            authHeader(req)
        );

        res.redirect("/questions");

    } catch (error) {

        if (error.response && error.response.status === 403) {
            return res.send(`
                <script>
                    alert("You are not author");
                    window.location.href = "/questions";
                </script>
            `);
        }

        res.status(500).send(error.message);
    }
});

module.exports = router;
