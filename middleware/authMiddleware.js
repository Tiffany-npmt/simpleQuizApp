const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
        if (err)
            return res.status(401).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
};

exports.verifyAdmin = (req, res, next) => {
    if (!req.user.admin)
        return res.status(403).json({ message: "Access access required!" });
    next();
};