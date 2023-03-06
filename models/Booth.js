const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const BoothSchema = mongoose.Schema({
    name : {
        type: String,
    },
    boothinfo: {
        type: String
    },
    menu : {
        type: Array,
    },
    

})