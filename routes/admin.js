const express = require("express");
const router = express.Router();
const fs = require("fs")

const db = require("../data/db")
const imageUpload = require("../helpers/image-upload")

// blogs
router.get("/blogs/delete/:blogid", async function(req, res) {
    const blogid = req.params.blogid
    try{
        await db.execute("DELETE FROM blog WHERE blogid=?", [blogid])

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
})

router.get("/blog/create", async function(req, res) {
    try{
        const [categories, ] = await db.execute("SELECT * FROM category")

        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });
    }catch(err){
        console.log(err)
    }
});

router.post("/blog/create", imageUpload.upload.single("resim"), async function(req, res) {
    const { baslik, altbaslik, aciklama, kategori } = req.body
    const resim = req.file.filename
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0
    const onay = req.body.onay == "on" ? 1 : 0

    try{
        await db.execute("INSERT INTO blog(baslik, altbaslik, aciklama, resim, anasayfa, onay, categoryid) VALUES (?,?,?,?,?,?,?)",
            [baslik, altbaslik, aciklama, resim, anasayfa, onay, kategori])

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
});

router.get("/blogs/:blogid", async function(req, res) {
    const blogid = req.params.blogid
    try{
        const [blogs, ] = await db.execute("SELECT * FROM blog WHERE blogid=?", [blogid])
        const [categories, ] = await db.execute("SELECT * FROM category")
        const blog = blogs[0]
        
        if(blog){
            return res.render("admin/blog-edit", {
                title: blog.baslik,
                blog: blog,
                categories: categories
            })
        }

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
    res.render("admin/blog-edit");
});

router.post("/blogs/:blogid", imageUpload.upload.single("resim"), async function(req, res) {
    const blogid = req.params.blogid
    const { baslik, altbaslik, aciklama, kategori } = req.body
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0
    const onay = req.body.onay == "on" ? 1 : 0
    let resim = req.body.resim;

    if(req.file) {
        resim = req.file.filename;

        fs.unlink("./public/images/" + req.body.resim, err => {
            console.log()
        })
    }

    try{
        await db.execute("UPDATE blog SET baslik=?, altbaslik=?, aciklama=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?", 
            [baslik, altbaslik, aciklama, resim, anasayfa, onay, kategori, blogid])

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
})

router.get("/blogs", async function(req, res) {
    try{
        const [blogs, ] = await db.execute("SELECT blogid, baslik, resim FROM blog")
        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs
        })
    }catch(err){
        console.log(err)
    }

    res.render("admin/blog-list");
});

// categories
router.get("/categories/delete/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid
    try{
        await db.execute("DELETE FROM category WHERE categoryid=?", [categoryid])

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
})

router.get("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid
    try{
        const [categories, ] = await db.execute("SELECT * FROM category WHERE categoryid=?", [categoryid])
        const category = categories[0]
        
        if(category){
            return res.render("admin/category-edit", {
                title: category.name,
                category: category
            })
        }

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
    res.render("admin/category-edit");
});

router.post("/categories/:categoryid", async function(req, res) {
    const categoryid = req.params.categoryid
    const { name } = req.body

    try{
        await db.execute("UPDATE category SET name=? WHERE categoryid=?", 
            [name, categoryid])

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
})

router.get("/category/create", async function(req, res) {
    try{
        res.render("admin/category-create", {
            title: "Add Category"
        });
    }catch(err){
        console.log(err)
    }
});

router.post("/category/create", async function(req, res) {
    const { name } = req.body

    try{
        await db.execute("INSERT INTO category(name) VALUES (?)",
            [name])

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
});

router.get("/categories", async function(req, res) {
    try{
        const [categories, ] = await db.execute("SELECT * FROM category")
        res.render("admin/category-list", {
            title: "category list",
            categories: categories
        })
    }catch(err){
        console.log(err)
    }

    res.render("admin/category-list");
});


module.exports = router;