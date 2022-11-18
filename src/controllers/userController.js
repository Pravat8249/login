const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")

const bcrypt = require("bcrypt")
const { isRequired, isInvalid, isValid } = require("../validations/userValid")

let initialCapital = function (value) {
    return value[0].toUpperCase() + value.slice(1).toLowerCase()
}


//1.
const registerUser = async function (req, res) {
    try {
        let data = req.body
     

        let getEmail = await userModel.findOne({ email: data.email }).collation({ locale: "en", strength: 2 })
        let getPhone = await userModel.findOne({ phone: data.phone })
        let error = []
        let err1 = isRequired(data)
        if (err1)
            error.push(...err1)

        let err2 = isInvalid(data, getEmail, getPhone)
        if (err2)
            error.push(...err2)

        if (error.length > 0)
            return res.status(400).send({ status: false, message: error })

        //changing data to proper format
        data.fname = initialCapital(data.fname.trim())
        data.lname = initialCapital(data.lname.trim())
       

      
        data.email = data.email.toLowerCase()

        data.password = await bcrypt.hash(data.password, 10)

      

        let created = await userModel.create(data)
        res.status(201).send({ status: true, message: "User created successfully", data: created })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



//2.
const userLogin = async function (req, res) {
    try {
        const email = req.body.email
        const password = req.body.password
        const data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "Please Enter E-mail and Password..." })
        }
        let error = []
        if (!isValid(email))
            error.push("Please Enter Email")
        if (!isValid(password))
            error.push("Please Provide Password")
        if (typeof data.email == "string" && !(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email?.trim())))
            error.push("enter a valid email")
        if (error.length > 0)
            return res.status(400).send({ status: false, msg: error })

        const user = await userModel.findOne({ email: email }).collation({ locale: "en", strength: 2 })
        if (!user) {
            return res.status(400).send({ status: false, msg: "email not found" })
        }
        let result = await bcrypt.compare(password, user.password)
        if (result == true) {
            const token = jwt.sign({
                userId: user._id
            }, "Project 5", { expiresIn: "300m" })
            res.status(200).send({ status: true, data: "logged in successfully", data: { token } })
        }
        else if (result == false)
            return res.status(400).send({ status: false, msg: "Incorrect Password" })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { registerUser, userLogin}