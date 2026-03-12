const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("Layout");
});
router.use(require("./userWeb"));
router.use(require("./quizWeb"));
router.use(require("./questionWeb"));

module.exports = router;
