const express = require("express");
const route = express.Router();
const { login, register, verifyEmail, deleteUser, verifyEmailPasswordReset, verifiedEmailPasswordReset, updatePassword } = require("../controllers/authController");
const { editPassword } = require('../controllers/modifyUserC')
route.post("/login", login);
route.get("/delete/:email", deleteUser)
route.get("/verify-mail/:signature", verifyEmail)
route.post("/register", register);
route.put('/edit-password', editPassword)

//Client initiates a mail that verifies their email
route.post("/forgot-password", verifyEmailPasswordReset)
//Client clicks on mail and the "canResetPassword" property is turned true
route.get("/verify-mail-password-reset/:signature", verifiedEmailPasswordReset)
//Finally update the password
route.put("/update-password", updatePassword);


module.exports = route;
