const Blog = require("../models/blog");
const Category = require("../models/category");

const { Op } = require("sequelize")

exports.blogs_by_category = async function(req, res) {
    const slug = req.params.slug
    try{
        const blogs = await Blog.findAll({
            where: {
                onay: true
            },
            include: {
                model: Category,
                where: { url: slug }
            },
            raw: true
        })
        const categories = await Category.findAll({ raw: true })
        // const [blogs, ] = await db.execute("SELECT * FROM blog WHERE categoryid=? AND onay=?", [id, 1])
        // const [categories, ] = await db.execute("SELECT * FROM category")

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: slug
        });
    }catch(err){
        console.log(err)
    }
}

exports.blogs_details = async function(req, res) {

    const slug = req.params.slug
    try{
        const blog = await Blog.findOne({
            where: {
                url: slug
            }
        })

        if(blog){
            return res.render("users/blog-details", {
                title: blog.baslik,
                blog: blog
            });
        }
        
        res.redirect("/")
    }catch(err){
        console.log(err)
    }
}

exports.blog_list = async function(req, res) {
    const size = 5
    const { page = 1 } = req.query

    try{
        const blogs = await Blog.findAll({
            where: {
                onay: true
            },
            raw: true,
            limit: size,
            offset: (page - 1) * 5
            // page == 1 => 0,
            // page == 2 => 5,
        })
        const categories = await Category.findAll({ raw: true })

        res.render("users/blogs", {
            title: "Tüm Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null
        });
    }catch(err){
        console.log(err)
    }
}

exports.index = async function(req, res) {
    try{
        const blogs = await Blog.findAll({
            where: {
                [Op.and]: [
                    { anasayfa: true },
                    { onay: true }
                ]
                // anasayfa: true,
                // onay: true
            },
            raw: true
        })
        const categories = await Category.findAll({ raw: true })

        res.render("users/index", {
            title: "Popüler Kurslar",
            blogs: blogs,
            categories: categories,
            selectedCategory: null
        });
    }catch(err){
        console.log(err)
    }
}