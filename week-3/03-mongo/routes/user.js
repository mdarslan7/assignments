const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

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

router.get("/courses", (req, res) => {
  Course.find().then((courses) => {
    res.json(courses);
  });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;

  User.updateOne(
    {
      username,
    },
    {
      $push: {
        purchasedCourses: courseId,
      },
    }
  )
    .then(() => {
      res.json("Course purchased successfully");
    })
    .catch((err) => {
      res.status(500).json({ error: "Error purchasing course" });
    });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  const user =  await User.findOne({
    username: req.headers.username
  })

  const courses = await Course.find({
    _id: {
      $in: user.purchasedCourses
    }
  })

  res.json(courses);
});

module.exports = router;
