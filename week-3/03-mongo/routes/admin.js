const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const { Admin, Course } = require("../db");

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  Admin.create({
    username,
    password,
  }).then((admin) => {
    res.json("Admin created successfully");
  });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  //implement input validation using zod

  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });

  res.json({
    message: "Course created successfully",
    course: newCourse._id,
  });
});

router.get("/courses", adminMiddleware, (req, res) => {
  Course.find().then((courses) => {
    res.json(courses);
  });
});

module.exports = router;
