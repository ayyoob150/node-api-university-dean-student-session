const UsersModel = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { userId, password  } = req.body;

  try {
    const user = await UsersModel.findOne({ userId});
    if (!user) {
      return res.json({
        user: false,
        error: "User not found",
      });
    }
    const pass = bcrypt.compareSync(password, user.password);
    if (pass) {
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
      res.json({ user: true,token, error: ""});
    } else {
      res.json({ user: false, error: "Incorrect password" });
    }
  } catch (err) {
    res.json({ user: false, error: "Login error" });
  }
};


module.exports = login;
