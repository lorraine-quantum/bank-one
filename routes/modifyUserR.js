const route = require("express").Router();
const { editUser, deleteUser, checkOtp } = require('../controllers/modifyUserC')

route.put('/edit-user', editUser)
route.post('/check-otp', checkOtp)
route.delete('/delete-user/:id', deleteUser)

module.exports = route