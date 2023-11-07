const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");


const userAuth = require("./routes/userAuth");
const StudentAppointment = require("./routes/appointment");

const UniversityModel = require("./model/university");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
dotenv.config();

app.use("/", userAuth);
app.use("/", StudentAppointment);


mongoose
  .connect(process.env.CONNECT_DB)
  .then(async () => {
    console.log("db connected");

    const university = await UniversityModel.find();
    // it will run only one time
    if (university.length == 0) {
      UniversityModel.insertMany([
        {
          universityId: "UNI12345",
          name: "University 1",
          password: "123456",
          Address: "Adress of university 1"
        },
        {
          universityId: "UNI54321",
          name: "University 2",
          password: "123456",
          Address: "Adress of university 2"
        },
      ]);
    }
  })
  .catch((e) => {
    console.log(e);
  });

const port = 4000;
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log(port);
});
