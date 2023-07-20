const config = require("../../config/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Db = require("../../database/db");

module.exports ={
    login: async (req, res) => {
        try {
          let email = req.body.email;
          let password = req.body.password;
          // res.json({ data: email, password });
          let user = await Db("user").where({ email: email }).first();
          if (!user) {
            return res.status(400).json({ data: "email tidak ditemukan" });
          }
          let checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword) {
            return res.status(400).json({ data: "password salah" });
          }
          let token = jwt.sign({ id: user.id }, config.jwtkey, { expiresIn: "1d" });
    
          await Db("user").where("id", user.id).update({
            token: token,
          });
    
          let data = await Db("user").where("id", user.id).first();
          res.status(200).json({ data: data });
        } catch (e) {
          console.log(e);
          res.status(500).json({ data: "gagal login",message:e });
        }
      },
      register: async (req, res) => {
        try {
          let username = req.body.username;
          let email = req.body.email;
          let password = req.body.password;
    
          let checkEmail = await Db("user").where({ email: email }).first();
          if (checkEmail) {
            return res.json({ data: "email sudah digunakan" });
          }
    
          // res.json({ data: username, email, password });
          // console.log(username, password, email);
          let salt = bcrypt.genSaltSync(10);
          let hash = bcrypt.hashSync(password, salt);
          let id = await Db("user").insert({
            username: username,
            password: hash,
            email: email,
          });
          return res.status(200).json({
            id: id[0],
            username: username,
            email: email,
          });
        } catch (e) {
          console.log(e);
          return res.status(500).json({ data: "gagal register", message:e });
        }
      },
    logout : async(req,res)=>{
        try{
            let id = req.params.id
            let data = await Db("user").where({id:id}).first()
            if(data!=null){
                await Db("user").where({id:id}).update({
                    token:""
                })
                return res.status(200).json({data:"berhasil logout"})
            }else{
                return res.status(200).json({data:"id tidak ditemukan, gagal logout"})
            }
        }catch(e){
            console.log(e)
            return res.status(500).json({data:"gagal logout",message:e})
        }
    }
}