const express = require("express");
const { User } = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");

router.post("/register", (req, res, next) => {
  console.log("회원가입");
  // console.log(req.body.email, req.body.name, req.body.password);

  const user = new User(req.body);
  console.log(user);
  user.save((err, doc) => {
    if (err) {
      return res.status(400).json({ success: false, err });
    }
    return res.status(200).json({ success: true });
  });
});

router.post("/login", (req, res, next) => {
  console.log("back login");  
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        success: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ success: false, message: "Wrong password" });
      }

      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.send(user);
      });
    });
  });
});

router.post("/logout", auth, (req, res, next) => {
  console.log(req.body.accessToken);
  return res.json({ success: true, message: "ok" });
});

module.exports = router;
