const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    getNotifications, getSingleNotification, deleteSingleNotification
} = require("../controllers/notification");

route.get("/single/:id", getSingleNotification);
route.delete("/single/:id", deleteSingleNotification);
route.get("/all", getNotifications);

module.exports = route;
