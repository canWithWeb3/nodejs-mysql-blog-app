const Category = require("../models/category")
const Blog = require("../models/blog")
const slugField = require("../helpers/slugField")

async function populate(){
    const count = await Category.count()

    if(count === 0){
        const categories = await Category.bulkCreate([
            {name: "Web Geliştirme", url: slugField("Komple Uygulamalı") },
            {name: "Mobil Geliştirme", url: slugField("Mobil Geliştirme") },
            {name: "Programlama", url: slugField("Programlama") },
            {name: "Veri Analizi", url: slugField("Veri Analizi") }
        ])

        const blogs = await Blog.bulkCreate([
            {
                baslik: "Komple Uygulamalı",
                url: slugField("Komple Uygulamalı"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "1.jpeg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Python ile Sıfırdan İleri",
                url: slugField("Python ile Sıfırdan İleri"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "2.jpeg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Javascript İleri Seviye Modern",
                url: slugField("Javascript İleri Seviye Modern"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "3.jpeg",
                anasayfa: false,
                onay: true
            },
            {
                baslik: "Python ile Sıfırdan İleri",
                url: slugField("Python ile Sıfırdan İleri"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "2.jpeg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Javascript İleri Seviye Modern",
                url: slugField("Javascript İleri Seviye Modern"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "3.jpeg",
                anasayfa: false,
                onay: true
            },
            {
                baslik: "Python ile Sıfırdan İleri",
                url: slugField("Python ile Sıfırdan İleri"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "2.jpeg",
                anasayfa: true,
                onay: true
            },
            {
                baslik: "Javascript İleri Seviye Modern",
                url: slugField("Javascript İleri Seviye Modern"),
                altbaslik: "Sıfırdan ileri",
                aciklama: "",
                resim: "3.jpeg",
                anasayfa: false,
                onay: true
            }
        ])

        await categories[0].addBlog(blogs[0])
        await categories[0].addBlog(blogs[1])

        await categories[1].addBlog(blogs[1])
        await categories[1].addBlog(blogs[2])
        await categories[2].addBlog(blogs[1])
        await categories[2].addBlog(blogs[2])
    }
}

module.exports = populate