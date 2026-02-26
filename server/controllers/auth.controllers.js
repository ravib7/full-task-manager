const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION, FRONTEND_URL } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")
const { otpTemplate } = require("../email-templates/otpTemplate")
const { differenceInSeconds } = require("date-fns")
const { forgetPasswordTemplate } = require("../email-templates/forgetPasswordTemplate")


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
        const { username } = req.body

        if (!username) {
            return res.status(400).json({ message: "email/mobile is required" })
        }

        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })

        if (!result) {
            return res.status(400).json({ message: "email/mobile registered with us" })
        }

        // create OTP
        const otp = await crypto.randomInt(100000, 1000000)

        // add to database
        // to convert to sring
        // String(otp)
        // otp.toString()
        const hashOTP = await bcrypt.hash(String(otp), 10)
        await User.findByIdAndUpdate(result._id, { otp: hashOTP, otpSendOn: new Date() })

        // send OTP email/sms/whatsapp
        await sendEmail({
            email: result.email,
            subject: "Login OTP",
            message: otpTemplate({
                name: result.name,
                otp,
                sec: process.env.OTP_EXPIRY,
                min: process.env.OTP_EXPIRY / 60
            })
        })

        res.json({ message: "send OTP successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to send OTP" })
    }
}

exports.verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body

        if (!username || !otp) {
            return res.status(400).json({ message: "all fields required" })
        }

        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })

        if (!result) {
            return res.status(400).json({ message: "email/mobile registered with us" })
        }

        const verify = await bcrypt.compare(otp, String(result.otp))

        if (!verify) {
            return res.status(400).json({ message: "invalid otp" })
        }
        //                        👇 current time        👇  past time
        if (differenceInSeconds(new Date(), new Date(result.otpSendOn)) > process.env.OTP_EXPIRY) {
            await User.findByIdAndUpdate(result._id, { otp: null })
            return res.status(400).json({ message: "otp expired" })
        }

        const token = await jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })

        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })

        res.status(200).json({
            message: "verify OTP successfully",
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
        res.status(500).json({ message: "unable to verify OTP" })
    }
}

exports.forgetPassword = async (req, res) => {
    try {
        const { username } = req.body

        if (!username) {
            return res.status(400).json({ message: "email/mobile is required" })
        }

        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })

        if (!result) {
            return res.status(400).json({ message: "email/mobile registered with us" })
        }

        const accessToken = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "15m" })

        await User.findByIdAndUpdate(result._id, { accessToken })

        // http://localhhost:3000/forget-password/?token=${accessToken}
        const link = `${FRONTEND_URL}/forget-password/?token=${accessToken}`

        await sendEmail({
            email: result.email,
            subject: "Request for chage password",
            message: forgetPasswordTemplate({ name: result.name, resetLink: link })
        })

        res.json({ message: "forget password successfully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to forget password" })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { token } = req.query

        const { password } = req.body

        if (!token) {
            return res.status(400).json({ message: "Token Required" })
        }

        const result = await User.findOne({ accessToken: token })

        if (!result) {
            return res.status(400).json({ message: "Token Required" })
        }

        jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                console.log(err)
                await User.findByIdAndUpdate(result._id, { accessToken: null })
                return res.status(400).json({ message: "Invalid Token" })
            }

            const hash = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate(result._id, { password: hash })
            res.json({ message: "change password successfully" })
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to change password" })
    }
}