const route = require("express").Router();
const { editUser, deleteUser, checkOtp, loggedInUpdatePassword } = require('../controllers/modifyUserC')

route.put('/edit-user', editUser)
route.post('/check-otp', checkOtp)
route.put('/v2/update-password', loggedInUpdatePassword)
route.delete('/delete-user/:id', deleteUser)

module.exports = route