export type TODO = {
    task: String
    desc: String
    priority: String
    employee: String
    due: Date
    _id: String
    completeDate: Date
    complete: Boolean
}
export type COMMON_RESPONSE = {
    message: String
}
export type GET_EMPLOYEE_RESPONSE = {
    message: String,
    result: {
        name: String,
        email: String,
        mobile: String,
        role: String,
        active: Boolean,
        isDelete: Boolean
    }
}

export type UPDATE_EMPLOYEE_REQUEST = {
    _id: String,
    name: String,
    email: String,
    mobile: String,
}
export type UPDATE_EMPLOYEE_RESPONSE = {
    message: String
}

export type TOGGLE_EMPLOYEE_REQUEST = {
    _id: String
    status: String
}
export type TOGGLE_EMPLOYEE_RESPONSE = {
    message: String
}

export type DELETE_EMPLOYEE_REQUEST = {
    _id: String
    isDelete: Boolean
}
export type DELETE_EMPLOYEE_RESPONSE = {
    message: String
}

export type RESTORE_EMPLOYEE_REQUEST = {
    _id: String
    isDelete: Boolean
}
export type RESTORE_EMPLOYEE_RESPONSE = {
    message: String
}

export type REMOVE_EMPLOYEE_REQUEST = {
    _id: String
}
export type REMOVE_EMPLOYEE_RESPONSE = {
    message: String
}

export interface TODO_CREATE_REQUEST {
    task: String
    desc: String
    priority: String
    employee: String
    due: Date
}
export type TODO_CREATE_RESPONSE = {
    message: String
}


export type TODO_READ_RESPONSE = {
    message: String,
    result: [TODO]
}

export interface TODO_UPDATE_REQUEST extends TODO_CREATE_REQUEST {
    _id: String,
}
export type TODO_UPDATE_RESPONSE = {
    message: String,
}

export type TODO_DELETE_REQUEST = {
    _id: String,
}
export type TODO_DELETE_RESPONSE = {
    message: String,
}