const express = require("express");
const router = express.Router();

const db = require("../data/db")

router.use("/blogs/category/:categoryid", async function(req, res) {
    const id =req.params.categoryid
    try{
        const [blogs, ] = await db.execute("SELECT * FROM blog WHERE categoryid=? AND onay=?", [id, 1])
        const [categories, ] = await db.execute("SELECT * FROM category")

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: id
        });
    }catch(err){
        console.log(err)
    }
})

router.use("/blogs/:blogid", async function(req, res) {
    const id = req.params.blogid
    try{
        const [blog, ] = await db.execute("SELECT * FROM blog WHERE blogid=? AND onay=?", [id, 1])

        if(blog[0]){
            return res.render("users/blog-details", {
                title: blog[0].baslik,
                blog: blog[0]
            });
        }
        
        res.redirect("/")
    }catch(err){
        console.log(err)
    }
});

router.use("/blogs", async function(req, res) {
    try{
        const [blogs, ] = await db.execute("SELECT * FROM blog WHERE onay=1")
        const [categories, ] = await db.execute("SELECT * FROM category")

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null
        });
    }catch(err){
        console.log(err)
    }
});

router.use("/", async function(req, res) {
    try{
        const [blogs, ] = await db.execute("SELECT * FROM blog WHERE onay=1 AND anasayfa=1")
        const [categories, ] = await db.execute("SELECT * FROM category")

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null
        });
    }catch(err){
        console.log(err)
    }
});

module.exports = router;