const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const { getUser } = require("../controllers/deposit");


route.get("/", getUser);


module.exports = route;
