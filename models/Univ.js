const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const UnivSchema = mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  name_eng : {
    type : String
  },
  address : {
    type : String
  },
  location: {
    type : String,
    maxlength: 50,
  },
  time : {
    type: String,
    maxlength: 50,
  },
  link : {
    type: String,
    maxlength: 50
  },
  celeb: { 
    type: Array,
    default: []
  },
  booth : [
    {
      user : {
        type : String
      },
      name: {
        type: String,
      },
      info: {
        type: String
      },
      menu: [
        {
          name : {
            type: String
          },
          price: {
            type: String
          }
        }
      ]
    }
  ],
  heart : {
    type : Array,
    default : []
  },
  
});

const Univ = mongoose.model("Univ", UnivSchema);

module.exports = { Univ };
