const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    userId: { type: String, unique:true, required: true},
    name: { type: String, required: true },
    password: { type: String, required: true },
    universityId : {type:String , require:true },
    role:{ type: String, required: true },
    
  },
  { timestamps: true }
);

const model = mongoose.model("Users" , User)

module.exports = model;