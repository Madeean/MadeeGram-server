const express = require("express");
const { getAllPost,getAllPostSesuaiFollowers, lovePost, unlovePost, addPost, deletePost} = require("./postController");
const router = express.Router();
const os = require("os");
const multer = require("multer");

const { cekLogin } = require("../../middleware/index");

// router.use(cekLogin);
router.get("/getallpost",getAllPost);
router.get("/getallpostfollowers",getAllPostSesuaiFollowers);
router.post("/lovepost/:id",lovePost)
router.post("/unlovepost/:id",unlovePost)
router.post("/addpost",multer({ dest: os.tmpdir() }).single("image"),addPost)
router.post("/deletepost/:id",deletePost)

module.exports = router