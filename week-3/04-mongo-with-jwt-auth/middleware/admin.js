const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const parts = token.split(" ");
  const jwtToken = parts[1];
  const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
  if (decoded.username) {
    next();
  } else {
    res.status(403).send({
      msg: "Unauthorized",
    });
  }
}

module.exports = adminMiddleware;