import { TODO } from "./Admin"



export type GET_TODO_REQUEST = {
    _id: String,
}

export type GET_TODO_RESPONSE = {
    message: String,
    result: [TODO]
}
export type TOGGLE_TODO_REQUEST = {
    _id: String,
    complete: Boolean,
}



export type GET_PROFILE_RESPONSE = {
    message: String,
    result: {
        name: String,
        email: String,
        mobile: String,
        role: String,
        active: Boolean,
        profilePic: String,
    },
}
export type UPDATE_PROFILE_REQUEST = {
    _id: String
    name: String,
    email: String,
    mobile: String,
}