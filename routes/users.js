const express = require("express");
const { User } = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const moment = require("moment");

router.post("/register", (req, res, next) => {
  console.log("회원가입");

  const user = new User(req.body);

  console.log(user);
  user.save((err, doc) => {
    console.log(user)
    if (err) {
      // console.log(err)
      return res.status(400).json({ success: false, message: '증복된 이메일 입니다.' });
    }
    return res.status(200).json({ success: true });
  });
});

router.post('/changepassword', (req,res,next) => {
  const newpassword = req.body.password
  const hashnewpassword = 
  console.log('changepassword');
  console.log(req.body)
  
  User.findOne({email: req.body.email}, (err,user) => {
   console.log(user)
    // return res.send(user)
    user.password = newpassword

    user.save((err,doc) => {
      if(err){
        console.log(err)
        return res.status(400).json({success:false, err})
      }
      return res.status(200).json({success: true})
    })
   
  })
  
}
)
router.post("/login", (req, res, next) => {
  console.log("back login");  
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        success: false,
        message: "해당 이메일이 존재하지 않습니다.",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ success: false, message: "비밀번호가 틀렸습니다." });
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
