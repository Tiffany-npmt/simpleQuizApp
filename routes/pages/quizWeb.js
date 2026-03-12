const express = require("express");
const router = express.Router();
const axios = require("axios");

const API = process.env.BASE_URL + "/api";

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

router.get("/quizzes", requireLogin, async (req, res) => {

    const response = await axios.get(`${API}/quizzes`, authHeader(req));

    res.render("quiz/list", {
        quizzes: response.data,
        user: req.session.user
    });

});

router.get("/quizzes/create", requireLogin, (req, res) => {
    res.render("quiz/create");
});

router.post("/quizzes/create", requireLogin, async (req, res) => {

    await axios.post(`${API}/quizzes`, req.body, authHeader(req));

    res.redirect("/quizzes");

});

router.post("/quizzes/delete/:id", requireLogin, async (req, res) => {

    await axios.delete(`${API}/quizzes/${req.params.id}`, authHeader(req));

    res.redirect("/quizzes");

});

router.get("/quizzes/:id", requireLogin, async (req, res) => {

    const quizId = req.params.id;

    const response = await axios.get(`${API}/quizzes/${quizId}`, authHeader(req));

    res.render("quiz/doingQuiz", {
        quiz: response.data,
        questions: response.data.questions || []
    });

});

router.get("/quizzes/details/:id", requireLogin, async (req, res) => {
    const quizId = req.params.id;

    const quizRes = await axios.get(`${API}/quizzes/${quizId}`, authHeader(req));

    res.render("quiz/detail", {
        quiz: quizRes.data,
        questions: quizRes.data.questions || []
    });
});

router.get("/quizzes/:id/question/create", requireLogin, (req, res) => {

    res.render("question/createInQuiz", {
        quizId: req.params.id
    });

});

router.post("/quizzes/:id/question/create", requireLogin, async (req, res) => {

    const quizId = req.params.id;

    const { text, o1, o2, o3, correct, keywords } = req.body;

    await axios.post(
        `${API}/quizzes/${quizId}/question`,
        {
            text,
            options: [o1, o2, o3],
            correctAnswerIndex: Number(correct),
            keywords: keywords
                ? keywords.split(",").map(k => k.trim())
                : []
        },
        authHeader(req)
    );

    res.redirect(`/quizzes/details/${quizId}`);

});

router.get("/quizzes/edit/:id", requireLogin, async (req, res) => {

    const response = await axios.get(`${API}/quizzes/${req.params.id}`, authHeader(req));

    res.render("quiz/edit", {
        quiz: response.data
    });

});

router.post("/quizzes/edit/:id", requireLogin, async (req, res) => {

    await axios.put(`${API}/quizzes/${req.params.id}`, req.body, authHeader(req));

    res.redirect("/quizzes");

});

router.post("/quizzes/:id/submit", async (req, res) => {
    const quizId = req.params.id;

    const response = await axios.post(
        `${API}/quizzes/${quizId}/submit`,
        req.body
    );
    res.render("quiz/result", {
        correct: response.data.correct,
        total: response.data.total
    });
});

module.exports = router;