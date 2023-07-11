const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/image-upload")

const adminController = require("../controllers/admin");
const isAuth = require("../middlewares/auth");
const csrf = require("../middlewares/csrf")

// blogs
router.get("/blogs/delete/:blogid", adminController.get_blog_delete)

router.get("/blog/create", [isAuth, csrf], adminController.get_blog_create);

router.post("/blog/create", imageUpload.upload.single("resim"), adminController.post_blog_create);

router.get("/blogs/:blogid", [isAuth, csrf], adminController.get_blog_edit);

router.post("/blogs/:blogid", imageUpload.upload.single("resim"), adminController.post_blog_edit)

router.get("/blogs", adminController.get_blogs);

// categories
router.post("/categories/remove", adminController.post_category_remove);

router.get("/categories/delete/:categoryid", adminController.get_category_delete)

router.get("/categories/:categoryid", [isAuth, csrf], adminController.get_category_edit);

router.post("/categories/:categoryid", adminController.post_category_edit)

router.post("/category/create", adminController.post_category_create);

router.get("/category/create", [isAuth, csrf], adminController.get_category_create);

router.get("/categories", adminController.get_categories);


module.exports = router;