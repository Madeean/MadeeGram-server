const config = require("../../config/index");
const Db = require("../../database/db");
const fs = require("fs");
var path = require("path");

module.exports ={
    getAllPost : async(req,res)=>{
        try{
            await Db("post").then((data)=>{
                if(data !=null){
                    return res.status(200).json({data:data})
                }else{
                    return res.status(300).json({data:"data kosong"})
                }
            }).catch((e)=>{
                console.log(e)
                return res.status(400).json({data:"gagal fetch data",message:e})
            })

        }catch(e){
            console.log(e)
            return res.status(500).json({data:"gagal mendapatkan data",message:e})
        }
    },
    getAllPostSesuaiFollowers :async(req,res)=>{
        try{
            // let idFollowers = req.body.idFollowers
            let idFollowers = "1,23,4,5"
            // slice idFollowers
            let idFollowersSlice = idFollowers.split(",")
            let data = []
            for(let i=0; i<idFollowersSlice.length; i++){
                data.push(await Db("post").where({id_user:idFollowersSlice[i]}))
            }

            if(data !=[]){
                return res.status(200).json({data:data})
            }else{
                return res.status(300).json({data:"data kosong"})
            }
            
        }catch(e){
            console.log(e)
            return res.status(500).json({data:"gagal mendapatkan data",message:e})
        }
    },
    lovePost:async(req,res)=>{
        try{
            let id=req.params.id
            let love_data = await Db("post").where({id:id}).first()
            let loveIncrement = love_data.love + 1
            return await Db("post").where({id:id}).update({
                love:loveIncrement
            }).then(
                res.status(200).json({data:loveIncrement,message:"berhasil love post"})
                ).catch((e)=>{
                    console.log(e)
                    return res.status(400).json({data:e,message:"gagal love post"})
                })
        }catch(e){
            console.log(e)
            return res.status(500).json({data:e,message:"gagal love post"})
        }
    },
    unlovePost:async(req,res)=>{
        try{
            let id=req.params.id
            let love_data = await Db("post").where({id:id}).first()
            
            if(love_data.love == 0){
                return res.status(200).json({data:null,message:"love sudah 0"})
            }

            let loveIncrement = love_data.love - 1
            return await Db("post").where({id:id}).update({
                love:loveIncrement
            }).then(
                res.status(200).json({data:loveIncrement,message:"berhasil unlove post"})
                ).catch((e)=>{
                    console.log(e)
                    return res.status(400).json({data:e,message:"gagal unlove post"})
                })
        }catch(e){
            console.log(e)
            return res.status(500).json({data:e,message:"gagal unlove post"})
        }
    },
    addPost:async(req,res)=>{
        try{
            let user_id = 2
            let description = req.body.description
            let date = getDate()
            
            if (req.file) {
                let tmp_path = req.file.path;
                let filename = getRandomNumber()+req.file.originalname
                let target_path = path.resolve(
                  config.rootPath,
                  `public/uploads/${filename}`
                );
        
                const src = fs.createReadStream(tmp_path);
                const dest = fs.createWriteStream(target_path);
                src.pipe(dest);
                const url =
                  req.protocol + "://" + req.get("host") + "/uploads/" + filename;
                src.on("end", async () => {
                  let id = await Db("post").insert({
                    user_id:user_id,
                    description:description,
                    date:date,
                    image: url,
                  });
        
                  return res.status(200).json(
                    {
                      data: {
                        id: id[0],
                        date,
                        description,
                        user_id,
                        image: url,
                      },
                      message:"berhasil tambah form dengan file"
                    },
                  );
                });
                src.on("error", async (e) => {
                 return res.status(300).json({data:e, message: "gagal tambah form dengan file" });
                });
              } else {
                return res.status(400).json({data:null, message: "gagal tambah form file tidak ada" })
              }

        }catch(e){
            console.log(e)
            return res.status(500).json({data:e,message:"gagal menambah post"})
        }
    },
    deletePost:async(req,res)=>{
        try{
            let id = req.params.id
            let data = await Db("post").where({id:id}).first()
            if(data == null){
                return res.status(300).json({data:null,message:"data tidak ada"})
            }
            let filename = data.image.split("/")[4]
            const filePath = path.resolve(
                config.rootPath,
                `public/uploads/${filename}`
              );
            fs.unlinkSync(filePath)
            await Db("post").where({id:id}).del()
            return res.status(200).json({data:null,message:"berhasil menghapus post"})
        }catch(e){
            console.log(e)
            return res.status(500).json({data:null,message:"gagal menghapus post"})
        }
    }
}

function getDate(){
    let date_ob = new Date();

      // current date
      // adjust 0 before single digit date
      let date = ("0" + date_ob.getDate()).slice(-2);

      // current month
      let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

      // current year
      let year = date_ob.getFullYear();

      // current hours
      let hours = date_ob.getHours();

      // current minutes
      let minutes = date_ob.getMinutes();

      // current seconds
      let seconds = date_ob.getSeconds();

      const created =
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds;

    return created
}

function getRandomNumber(){
    let min = 1
    let max = 100
    return Math.floor(Math.random() * (max - min + 1)) + min;
}