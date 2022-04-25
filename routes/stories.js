const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Story = require("../models/Story");

// @desc    Show add page
// @route   GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @desc    Process the add form
// @route   POST /stories
router.post("/", ensureAuth, async (req, res) => {
  console.log(req);
  try {
    // add the user to the body req
    req.body.user = req.user.id;
    //create a data to pass in a model from req.body
    await Story.create(req.body);
    // push the user back to the dashboard
    res.redirect("/dashboard");
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

// @desc    Get all the stories
// @route   GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      //papulate is like bringing the user to stories querry
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    console.log(stories);
    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

module.exports = router;
