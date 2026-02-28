const { getAllTodos, toggleTodoStatus, getProfile, updateProfile } = require("../controllers/employee.controllers")

const router = require("express").Router()

router
    .get("/todos", getAllTodos)
    .put("/todos-update/:tid", toggleTodoStatus)

    .get("/profile", getProfile)
    .put("/profile-update", updateProfile)

module.exports = router