const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")


exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "email or password are required" })
        }

        const result = await User.findOne({ email })

        if (!result) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Invalid Credentials"
                    : "Email Not Found"
            })
        }

        if (!result.active) {
            return res.status(401).json({ message: "account blocked by admin" })
        }

        const verify = await bcrypt.compare(password, result.password)

        if (!verify) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "Invalid Credentials"
                    : "Invalid Password"
            })
        }

        const token = await jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })

        res.status(200).json({
            message: "login successfully",
            result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login" })
    }
}

exports.registerEmployee = async (req, res) => {
    try {
        // only admin can register employee
        const { name, email, mobile } = req.body

        if (!name || !email || !mobile) {
            return res.status(400).json({ message: "all fileds required" })
        }

        const isFound = await User.findOne({ $or: [{ email }, { mobile }] })

        if (isFound) {
            return res.status(401).json({ message: "email/mobile already exist" })
        }

        const pass = crypto.randomBytes(8).toString("hex")

        const password = await bcrypt.hash(pass, 10)

        // send email
        await sendEmail({
            email,
            subject: `welcomeelcome To Task Manager`,
            message: registerTemplate({ name, password: pass })
        })

        await User.create({ name, email, mobile, password, role: "employee" })

        res.json({ message: "register employee successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register employee" })
    }
}

exports.signout = async (req, res) => {
    try {
        res.clearCookie("TOKEN")
        res.json({ message: "signout successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to signout" })
    }
}

exports.sendOTP = async (req, res) => {
    try {
        res.json({ message: "send OTP successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to send OTP" })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        res.json({ message: "verify OTP successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to verify OTP" })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        res.json({ message: "forget password successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to forget password" })
    }
}

exports.changePassword = async (req, res) => {
    try {
        res.json({ message: "change password successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to change password" })
    }
}