const config = require("../config/index");
const jwt = require("jsonwebtoken");
const Db = require("../database/db");
module.exports = {
  cekLogin: async (req, res, next) => {
    try {
      let token = req.headers.authorization
        ? req.headers.authorization.replace("Bearer ", "")
        : null;
      // res.json({ data: token });
      if (!token) {
        return res.status(400).json({ data:null,message: "token tidak ada login dahulu" });
      }
      let decode = jwt.verify(token, config.jwtkey);
      let user = await Db("user").where({ id: decode.id }).first();
      if (!user) {
        return res.status(400).json({ data:null, message: "pakai akun yang sudah login" });
      }
      let user_with_token = await Db("user").where("id", user.id).first();
      if (user_with_token.token != token) {
        return res.status(400).json({ message: "token tidak valid",data:null });
      }
      req.user = user;
      next();
    } catch (e) {
      console.log(e);
      return res.status(500).json({ data: "kesalahan pada server" });
    }
  },
};
