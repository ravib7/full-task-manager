export type SIGNIN_REQUEST = {
    email: String,
    password: String,
}
export type SIGNIN_RESPONSE = {
    message: String,
    result: {
        name: String,
        email: String,
        mobile: String,
        profilePic: String,
        _id: String,
        role: String,
    }
}
export type REGISTER_EMPLOYEE_REQUEST = {
    name: String,
    email: String,
    mobile: String,
}
export type REGISTER_EMPLOYEE_RESPONSE = {
    message: String
}


export type SEND_OTP_REQUEST = {
    username: String,
}
export type SEND_OTP_RESPONSE = {
    message: String
}

export type VERIFY_OTP_REQUEST = {
    username: String,
    otp: String,
}
export type VERIFY_OTP_RESPONSE = {
    message: String
}


export type FORGET_PASSWORD_REQUEST = {
    username: String,
}
export type FORGET_PASSWORD_RESPONSE = {
    message: String
}

export type CHANGE_PASSWORD_REQUEST = {
    password: String,
    token: String,
}
export type CHANGE_PASSWORD_RESPONSE = {
    message: String
}