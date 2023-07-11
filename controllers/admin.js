const Blog = require("../models/blog")
const Category = require("../models/category")
const { Op } = require("sequelize")
const sequelize = require("../data/db")
const slugField = require("../helpers/slugField")

const fs = require("fs")


// blogs
exports.get_blog_delete = async function(req, res) {
    const blogid = req.params.blogid
    try{
        const blog = await Blog.findByPk(blogid)

        if(blog){
            await blog.destroy()
        }
        // await db.execute("DELETE FROM blog WHERE blogid=?", [blogid])

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
}

exports.get_blog_create = async function(req, res) {
    try{
        const categories = await Category.findAll()

        res.render("admin/blog-create", {
            title: "Add Blog",
            categories: categories
        });
    }catch(err){
        console.log(err)
    }
}

exports.post_blog_create = async function(req, res) {
    const { baslik, altbaslik, aciklama, categories } = req.body
    const resim = req.file.filename
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0
    const onay = req.body.onay == "on" ? 1 : 0

    try{
        await Blog.create({
            baslik: baslik,
            url: slugField(baslik),
            altbaslik: altbaslik,
            aciklama: aciklama,
            resim: resim,
            anasayfa: anasayfa,
            onay: onay
        })

        res.redirect("/admin/blogs")
    }catch(err){
        console.log(err)
    }
}

exports.get_blog_edit = async function(req, res) {
    const blogid = req.params.blogid
    try{
        const blog = await Blog.findOne({
            where: {
                id: blogid
            },
            include: {
                model: Category,
                attributes: ["id"]
            }
        })
        const categories = await Category.findAll()
        
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
}

exports.post_blog_edit = async function(req, res) {
    const blogid = req.params.blogid
    const { baslik, altbaslik, aciklama, categories } = req.body
    const anasayfa = req.body.anasayfa == "on" ? 1 : 0
    const onay = req.body.onay == "on" ? 1 : 0
    let resim = req.body.resim;

    if(req.file) {
        resim = req.file.filename;

        fs.unlink("./public/images/" + req.body.resim, err => {
            console.log(err)
        })
    }

    try{
        const blog = await Blog.findOne({
            where: { id: blogid },
            include: { model: Category, attributes: ["id"] }
        })
        if(blog){
            blog.baslik = baslik,
            blog.url = slugField(baslik),
            blog.altbaslik = altbaslik,
            blog.aciklama = aciklama,
            blog.resim = resim,
            blog.anasayfa = anasayfa,
            blog.onay = onay

            if(categories == undefined){
                await blog.removeCategories(blog.categories)
            }else{
                await blog.removeCategories(blog.categories)
                // galiba bu kategoriler burda varmı diye kontrol ediyor
                const selectedCategories = await Category.findAll({
                    where: {
                        id: {
                            [Op.in]: categories
                        }
                    }
                })

                await blog.addCategories(selectedCategories)
            }

            await blog.save()
        }
        // await db.execute("UPDATE blog SET baslik=?, altbaslik=?, aciklama=?, resim=?, anasayfa=?, onay=?, categoryid=? WHERE blogid=?", 
        //     [baslik, altbaslik, aciklama, resim, anasayfa, onay, kategori, blogid])

        res.redirect("/admin/blogs")
    }catch(err){
        console.log("POST BLOG EDİT",err)
    }
}

exports.get_blogs = async function(req, res) {
    try{
        const blogs = await Blog.findAll({
            attributes: ["id", "baslik", "altbaslik", "resim"],
            include: {
                model: Category,
                attributes: ["name"]
            }
        })

        res.render("admin/blog-list", {
            title: "blog list",
            blogs: blogs
        })
    }catch(err){
        console.log(err)
    }

    res.render("admin/blog-list");
}

// categories
exports.get_category_delete = async function(req, res) {
    const categoryid = req.params.categoryid
    try{
        const category = await Category.findByPk(categoryid)

        if(category){
            await category.destroy()
        }
        // await db.execute("DELETE FROM category WHERE categoryid=?", [categoryid])

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
}

exports.get_category_edit = async function(req, res) {
    const categoryid = req.params.categoryid
    try{
        const category = await Category.findByPk(categoryid)
        const blogs = await category.getBlogs()
        const countBlog = await category.countBlogs()

        if(category){
            return res.render("admin/category-edit", {
                title: category.name,
                category: category,
                blogs: blogs,
                countBlog: countBlog
            })
        }

        res.redirect("/admin/categories")
    }catch(err){
        console.log("GET_CATEGORY_EDİT ", err)
    }
    res.render("admin/category-edit");
}

exports.post_category_edit = async function(req, res) {
    const categoryid = req.params.categoryid
    const { name } = req.body

    try{
        const category = await Category.findByPk(categoryid)

        if(category){
            category.name = name

            await category.save()
        }
        // await db.execute("UPDATE category SET name=? WHERE categoryid=?", 
        //     [name, categoryid])

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
}

exports.get_category_create = async function(req, res) {
    try{
        res.render("admin/category-create", {
            title: "Add Category"
        });
    }catch(err){
        console.log(err)
    }
}

exports.post_category_remove = async function(req, res) {
    try{
        const { blogid, categoryid } = req.body
        await sequelize.query(`DELETE FROM blogCategories WHERE blogId=${blogid} AND categoryId=${categoryid}`)
        console.log("YESSSSSSSSSSSSSSSSSSSSSS")
        res.redirect("/admin/categories/" + categoryid)
    }catch(err){
        console.log("CATEGORY REMOVE", err)
    }
}

exports.post_category_create = async function(req, res) {
    const { name } = req.body

    try{
        await Category.create({ name: name, url: slugField(name) })

        res.redirect("/admin/categories")
    }catch(err){
        console.log(err)
    }
}

exports.get_categories = async function(req, res) {
    try{
        const categories = await Category.findAll()

        res.render("admin/category-list", {
            title: "category list",
            categories: categories
        })
    }catch(err){
        console.log(err)
    }

    res.render("admin/category-list");
}
