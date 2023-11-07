const UsersModel = require("../model/user");
const UniversityModel = require("../model/university");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const uuid = require("uuid");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  let userId = uuid.v4().substring(0, 8).toUpperCase();
  const {name , password , universityId , role} = req.body;

  if(role!=="student" && role !=="dean"){
    return res.json({ user: false, university: false, error: "role must be student or dean" });
  }
  const hash = bcrypt.hashSync(password, saltRounds);
  try {
    const findUniversity = await UniversityModel.findOne({
      universityId
    });

    if (findUniversity) {
      try {
        const user = await UsersModel.create({
          userId,
          name,
          password:hash,
          universityId,
          role
        });
        if (!user) {
          console.log("user not created");
          return;
        } else {         
            const token = await jwt.sign(
              {
                _id: user._id,
                userId: user.userId,
                name: user.name,
                universityId: user.universityId,
                role:user.role,
              },
              process.env.SECRET,
              {expiresIn:"1h"}
            );
          res.json({ user: true, university: true, token, error: "" });
        }
        
      } catch (e) {
        console.log("dublicate error", e);
        res.json({
          user: false,
          university: false,
          error: "Dublicate User",
        });
        return;
      }

    } else {
      res.json({
        user: false,
        university: false,
        error: "Unniversity not find",
      });
      return;
    }
  } catch (error) {
    console.log(error)
    res.json({ user: false, university: false });
    return;
  }
};

module.exports = signup;
