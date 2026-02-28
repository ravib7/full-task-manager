const { getAllEmployees, updateEmployee, toggleEmployeeStatus, deleteEmployee, createTask, updateTask, readTask, deleteTask, restoreEmployee, permanentDeleteEmployee } = require("../controllers/admin.controllers.js")

const router = require("express").Router()

router
    .get("/employee", getAllEmployees)
    .put("/update-employee/:eid", updateEmployee)
    .put("/toggle-employee-status/:eid", toggleEmployeeStatus)
    .delete("/delete-employee/:eid", deleteEmployee)
    .put("/restore-delete-employee/:eid", restoreEmployee)
    .delete("/remove/:eid", permanentDeleteEmployee)

    .post("/todo-create", createTask)
    .get("/todo", readTask)
    .put("/todo/:tid", updateTask)
    .delete("/todo/:tid", deleteTask)


module.exports = router