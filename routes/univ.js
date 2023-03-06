const express = require("express");
const { Univ } = require("../models/Univ");
const { User } = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const path = require('path');
const fs = require('fs');


const jsonPath = path.resolve(__dirname,'alluniv.json');
const jsonData = fs.readFileSync(jsonPath);

const alluniv = JSON.parse(jsonData);



router.get("/info", (req, res, next) => {
  //   let k = "a";
  Univ.findOne({ name: "서울대학교" }, (err, univ) => {
    console.log(univ);
    return res.send(univ);
  });
});

router.get('/test', (req,res,next)=> {
  Univ.findOne({ name: "DGIST" }, (err, univ) => {
    console.log(univ);
    return res.send(univ);
  });
})
router.post("/test2",(req,res,next) => {
  Univ.updateOne({name: "DGIST"}, {$push: {celeb: "hellworold"}}, (err,result)=> {
    if(!result) {
      console.log(result)
      return res.send(result)
    }
    console.log("success")
    return res.send(result)
  })
})  

router.post("/search", (req, res, next) => {
  console.log(req.body.univ);
  Univ.findOne({ name: req.body.univ }, (err, result) => {
    console.log(result);
    if (!result) {
      return res.send({ success: false, message: "해당 대학이 없다" });
    }
    return res.send({ success: true, result });
  });
});

router.post("/getunivname", (req,res,next) => {
  let arrdata = [];
  let title = req.body.univ
  if (title.length === 0){
    return res.send({success: true, arrdata});
  }
  // console.log(title)
  const regex = (pattern) => new RegExp(`.*${pattern}.*`);
  const titleRegex = regex(title);
  console.log(titleRegex)
  Univ.find( {name: {$regex : titleRegex, '$options' : 'i'}}, (err,result) => {
    if(!err) {
      for (var i = 0; i<result.length;i++) {
        arrdata.push(result[i].name);
      }
      // console.log(arrdata)
      return res.send({success: true, arrdata})
      
    }
  })

})

router.post('/getmybooth',(req,res,next) => {
  let univ = req.body.univ;
  let email = req.body.email;
  Univ.findOne({name:univ,user:email}, (err,result) => {
    if (!result) {
      return res.send({success: false, message: 'Fail'})
    }

    let final = result.booth;
    // console.log(final);
    return res.send({success:true, data:final})
  })
})

router.post("/getboothinfo", (req,res,next)=> {
  let univ = req.body.univ;
  Univ.findOne({name : univ}, (err,result) => {
    // console.log(result);
    if (!result) {
      return res.send({success: false, message: '실패'})
    }

    let final = result.booth;
    return res.send({success: true, data: final})
  })
 
})

router.get("/testaaa", (req,res,next) => {
  let univ = "DGIST";
  let name = "test123";
  let info = 'test456';
  let menu = [
    {name : '10000',price : 'helloworld'},
    {name: '20000',price: 'happyjun'}
  ];

  Univ.updateOne({name:univ}, {$push: {
    booth: {
      name : name,
      info: info,
      menu : menu
    }
  }}, (err,result) => {
    if(!result) {
      console.log(result);
      res.send(result)
    }
    res.send(result);
  })
})

router.post('/deletebooth', (req,res,next) => {
  let item = req.body.item;
  let univ = req.body.univ;
  let user = item.user;
  let name = item.name
  // const query = {
  //   user : user,
  //   name : name
  // }
  Univ.updateOne({name: univ}, {$pull : {
    booth: {
      name : name,
      user : user
    }
  }}, (err,result) => {
    if (!result) {
      // console.log(result);
      res.send(result);
    }
    // console.log("Success");
    res.send(result);
  })

  // res.send(item);
})

router.post("/addbooth", (req,res,next)=> {
  console.log(req.body)
  let univ = req.body.newlist.univ;
  let name = req.body.newlist.name;
  let info = req.body.newlist.info;
  let menu = req.body.newlist.menu; 
  let user = req.body.newlist.user;
  console.log(univ,name,info,menu)
  Univ.updateOne({name:univ}, {$push : {
    booth : {
      name : name,
      user : user,
      info: info,
      menu: menu
    }
  }}, (err,result) => {
    if (!result) {
      console.log(result);
      res.send(result)
    }
    console.log("success");
    res.send(result);
  })
})

// Insert the every university

router.get("/allunivinsert",(req,res,next) => {
  for (let i = 10; i< 12 ; i++) {
    Univ.create({name: alluniv[i].학교명, link: alluniv[i].홈페이지, location: "", },(err,result) => {
      if(!result){
        console.log(result);
        res.send(result);
      }
    })
  }
  res.send(alluniv)
})

module.exports = router;
