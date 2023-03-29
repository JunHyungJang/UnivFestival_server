const express = require("express");
const { Univ } = require("../models/Univ");
const { User } = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const path = require('path');
const fs = require('fs');

const k = "hello"
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
  Univ.findOne({ name: "대구경북과학기술원" }, (err, univ) => {
    console.log(univ);
    return res.send(univ);
  });
})
router.post("/test2",(req,res,next) => {
  Univ.updateOne({name: "대구경북과학기술원"}, {$push: {celeb: "hellworold"}}, (err,result)=> {
    if(!result) {
      console.log(result)
      return res.send(result)
    }
    console.log("success")
    return res.send(result)
  })
})  

router.post("/search", (req, res, next) => {
  console.log(req.body);
  Univ.findOne( { name: req.body.univ }, (err, result) => {
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
  Univ.find( {
    $or : [{name: {$regex : titleRegex, '$options' : 'i'}},
     
    ]}, (err,result) => {
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
  console.log("info", univ,email)
  Univ.findOne({name:univ, 'booth.user':email}, (err,result) => {
    if (!result) {
      return res.send({success: false, message: 'Fail'})
    }

    let final = result.booth;
    console.log(final)
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
  // console.log('hello')
  console.log(alluniv.length)
  for (let i = 0; i< 443 ; i++) {
    Univ.create({
      name: alluniv[i].학교명, 
      name_eng: alluniv[i].학교명영문, 
      link: alluniv[i].홈페이지, 
      address: alluniv[i].주소, 
      number: alluniv[i].전화번호, 
      location: "미정",
      time : "미정", 
      celeb : [],
     },(err,result) => {
      if(!result){
        console.log(result);
        res.send(result);
      }
    })
  }
  res.send(alluniv)
})

router.post("/heartcount", (req,res,next) => {
  console.log("getheart")
  const univ = req.body.univname;
  console.log(univ);
  Univ.aggregate([
    {
      $match : {
        name : univ
      }
    },{
      $project: {
        array_length: {$size : "$heart"}
      }
    }
  ], (err,result) => {
    console.log(result[0].array_length);

    if(result){
      const data = result[0].array_length
      res.status(200).send(data.toString())
    }
    
  })
})

router.post("/heartchange", async (req,res,next) => {
  console.log('heartchange');
  const univ = req.body.univname;
  const user = req.body.email;
  console.log(univ,user)
 
  Univ.findOne({name: univ},{ heart: { $elemMatch: { $eq: user }}}, (err,result) => {
    console.log(result.heart.length)
    if (result.heart.length != 0){
      Univ.updateOne({name: univ}, {$pull: {heart: user}}, (err,result) => {
        if(result){
          console.log("successfuly deleted")
          res.status(200).send({message: "delete"})
        }
      })
    }
    else {
      Univ.updateOne({name: univ}, {$push : {heart:user}}, (err,result) => {
        if (result){
          console.log('successfully inserted' )
          res.status(200).send({message: "insert"})
        }
      })
     
    }
  })

  
})

router.post("/heartfind", (req,res,next) => {
  console.log("heartfind")
  console.log(req.body)
  const univ = req.body.univname;
  const user = req.body.email;
  console.log(univ,user)

  Univ.findOne({name: univ},{ heart: { $elemMatch: { $eq: user }}}, (err,result) => {
    if (result){
      console.log(result)
      console.log('success')
      res.send(result)
    }
    else {
      console.log("fail");
      console.log(result)
      res.send(result)
    }
  })

})

router.get("/popularfestival" , (req,res,next) => {
  let univarray = []
  let univheart = []
  Univ.aggregate([{$project: { heartcount : { $size : '$heart'}, heart : 1, name : 1}},
  {$sort: {heartcount: -1}},
  {$limit : 5}],(err,result) => {
    if(result){
      console.log(result)
      for (let i = 0 ; i<5 ; i ++) {
        univarray.push(result[i].name);
        univheart.push(result[i].heartcount)
      }
      res.status(200).send({univarray: univarray, univheart: univheart})
    }
  })
})

module.exports = router;
