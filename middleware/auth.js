const { User } = require("../models/User");

let auth = (req, res, next) => {
  //   console.log("reqbody", req.body.accessToken);
  let token = req.body.accessToken;
  //   console.log("token", token);

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });
    // console.log(req.token, "req.token");
    req.token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
