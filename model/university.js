const mongoose = require("mongoose");
const uuid = require('uuid');
let universityId = uuid.v4().substring(0, 8).toUpperCase();

const University = new mongoose.Schema(
  {
    universityId: { type: String, unique:true, required: true, default: universityId},
    name: { type: String, required: true, unique : true },
    password: { type: String, required: true },
    Address:{type:String,required:true},
    role:{ type: String, required: true, default: "University" }
  },
  { timestamps: true }
);

const model = mongoose.model("University" , University)

module.exports = model;