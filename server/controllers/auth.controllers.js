exports.signin = async (req, res) => {
    try {
        res.status(200).json({ message: "login successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login" })
    }
}

exports.registerEmployee = async (req, res) => {
    try {
        res.json({ message: "register employee successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register employee" })
    }
}

exports.signout = async (req, res) => {
    try {
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