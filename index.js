const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
// console.log(config.mongoURI);
const connect = mongoose
  .connect(
    "mongodb+srv://kevin0459:!kevin0459@cluster0.jhgpd3v.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/univ", require("./routes/univ"));

app.get("/", (req, res) => {
  console.log("hellworold");
  res.send("helloworld");
});

const admin = require("firebase-admin");
const serviceAccount = require("./univfestival-android-firebase-adminsdk-k710h-01f8d38de3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});