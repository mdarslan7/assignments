const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.create({
    username,
    password,
  }).then((user) => {
    res.json("User created successfully");
  });
});

router.post("/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign(
      {
        username,
      },
      process.env.JWT_SECRET
    );
    res.json({
      token,
    });
  } else {
    res.status(403).send({
      msg: "Unauthorized",
    });
  }
});

router.get("/courses", (req, res) => {
  Course.find().then((courses) => {
    res.json(courses);
  });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  const courseId = req.params.courseId;
  const username = req.username;

  User.updateOne(
    {
      username,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  ).then(() => {
      res.json("Course purchased successfully");
    })
    .catch((err) => {
      res.status(500).json({ error: "Error purchasing course" });
    });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
    const user =  await User.findOne({
        username: req.username
      })
    
      const courses = await Course.find({
        _id: {
          $in: user.purchasedCourses
        }
      })
    
      res.json(courses);
});

module.exports = router;
