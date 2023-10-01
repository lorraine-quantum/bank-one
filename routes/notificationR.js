const route = require("express").Router();
const auth = require('../middleware/authentication')
route.use(auth)
const {
    getNotifications, deleteMultipleNotification, getSingleNotification, deleteSingleNotification
} = require("../controllers/notification");

route.get("/single/:id", getSingleNotification);
route.delete("/single/:id", deleteSingleNotification);
route.delete("/multiple", deleteMultipleNotification);
route.get("/all", getNotifications);

module.exports = route;
