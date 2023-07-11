const bcrypt = require("bcrypt")
const User = require("../models/user")
// const emailService = require("../helpers/send-mail")
// const config = require("../config")

exports.get_logout = async (req, res) => {
    await req.session.destroy()
    return res.redirect("/")
}

exports.get_register = async (req, res) => {
    try{
        return res.render("auth/register", {
            title: "register"
        })
    }catch(err){
        console.log(err)
    }
}

exports.post_register = async (req, res) => {
    try{
        const { name, email, password } = req.body

        const user = await User.findOne({ where: { email: email } })
        if(user){
            return res.redirect("/bu email var")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            fullName: name,
            email: email,
            password: hashedPassword
        })

        // await emailService.sendMail({
        //     from: config.email.from,
        //     to: newUser.email,
        //     subject: "Hesabınız oluşturuldu",
        //     text: "Hesabınız başarılı bir şekilde oluşturuldu"
        // })
        
        res.redirect("login")
    }catch(err){
        console.log(`Register post error: ${err}`)
    }
}

exports.get_login = (req, res) => {
    try{
        res.render("auth/login", {
            title: "login",
            csrfToken: req.csrfToken()
        })
    }catch(err){
        console.log(err)
    }
}

exports.post_login = async (req, res) => {
    try{
        const { email, password } = req.body

        const user = await User.findOne({where: {email: email} })

        // user control
        if(!user){
            return res.render("auth/login", {
                title: "login",
                message: "email hatalı"
            })
        }

        // password control
        const match = await bcrypt.compare(password, user.password)
        if(!match){
            return res.render("auth/login", {
                title: "login",
                message: "parola hatalı"
            })
        }

        // req -res
        // cookie
            // res.cookie("isAuth", 1)
        // session
            req.session.isAuth = true
            req.session.fullName = user.fullName
        // session in db
        // token-based auth api

        res.redirect("/")
    }catch(err){
        console.log(err)
    }
}