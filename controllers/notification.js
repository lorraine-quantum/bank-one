const Notification = require("../models/Notification");
const { uploadId } = require('./uploadIdC')
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0

const adminAddNotification = async (req, res) => {

    try {


        uniqueId++
        let day = new Date().getDate()
        let month = new Date().getMonth()
        let year = new Date().getFullYear()
        const date = `${day}-${month + 1}-${year}`
        req.body.owner = req.decoded.id;
        req.body.date = date;
        req.body.id = uuidv4();
        //add the amount deposited to the total deposits field in the user schema
        req.body.reference = "#" + uuidv4().substring(0, 8)
        const user = await User.findOne({ email: req.body.user })
        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" })
        }
        req.body.filterId = user.id
        req.body.owner = user._id
        req.body.filterName = user.name
        // await User.findOneAndUpdate({ _id: req.decoded.id }, { pendBalance: user.pendBalance + req.body.amount }, { new: true })

        const newNotification = await Notification.create(req.body)
        const getPopulated = await Notification.findOne({ _id: newNotification._id }).populate({ path: "owner", model: "user" });


        res.status(StatusCodes.CREATED).json(getPopulated);
        // console.log(req.decoded.name)
    } catch (error) {
        console.log(error.message);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};


const getSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const ownerId = req.decoded.id;
        const singleNotification = await Notification.findOne({
            _id: NotificationId,
            owner: ownerId,
        })

        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        singleNotification.read = true;
        await singleNotification.save()
        res.status(StatusCodes.OK).json(singleNotification);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const deleteSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const ownerId = req.decoded.id;
        const singleNotification = await Notification.findOneAndRemove({
            _id: NotificationId,
            owner: ownerId,
        })
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleNotification);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const deleteMultipleNotification = async (req, res) => {
    try {


        const ownerId = req.decoded.id;
        const { idsToDelete } = req.body
        if (!idsToDelete || !Array.isArray(idsToDelete)) {
            throw new BadRequest("invalid ids")
        }
        const deleted = await Notification.deleteMany({
            _id: { $in: idsToDelete },
            owner: ownerId,
        })
        console.log(
            deleted.deletedCount
        )

        return res.status(StatusCodes.OK).json({ message: `Deleted ${deleted.deletedCount} ${deleted.deletedCount < 1 ? "notification" : "notifications"}` });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Check your Id format" });
    }
};
const getNotifications = async (req, res) => {
    try {
        const ownerId = req.decoded.id;
        const allNotifications = await Notification.find({ owner: ownerId }).sort({ createdAt: "-1" });
        res
            .status(StatusCodes.OK)
            .json({ allNotifications });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetNotifications = async (req, res) => {
    try {
        // res.set('Access-Control-Expose-Headers','Content-Range')
        // res.set('X-Total-Count',10)
        // res.set('Content-Range',10)

        const searchFilter = JSON.parse(req.query.filter).q
        const userFilter = JSON.parse(req.query.filter).userId
        if (searchFilter) {
            // const user = await User.findOne({})  
            console.log("here")

            const allNotifications = await Notification.find({ filterName: { $regex: searchFilter, $options: 'i' } })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))
            // res.set('Access-Control-Expose-Headers','X-Total-Count')
            // res.set('X-Total-Count',10)
            res
                .status(StatusCodes.OK)
                .json(allNotifications);
            return

        }

        if (userFilter) {
            console.log("eree")
            const allNotifications = await Notification.find({ filterId: userFilter })
                .populate({ path: "owner", model: "user" })
                .sort({ createdAt: -1 })
            // .limit(Number(req.query._end))
            // .skip(Number(req.query._start))

            // res.set('Access-Control-Expose-Headers','Content-Range')
            // res.set('X-Total-Count',10)
            // res.set('Content-Range',10)
            res
                .status(StatusCodes.OK)
                .json(allNotifications);
            return
        }
        const allNotifications = await Notification.find({})
            .populate({ path: "owner", model: "user" })
            .sort({ createdAt: -1 })
        // .limit(Number(req.query._end))
        // .skip(Number(req.query._start))

        // console.log(res.Access-Control-Expose-Headers)

        res
            .status(StatusCodes.OK)
            .json(allNotifications);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const singleNotification = await Notification.findOne({
            id: NotificationId
        }).populate({ path: "owner", model: "user" });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleNotification);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleNotification = async (req, res) => {
    try {

        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const singleNotification = await Notification.findOne({
            id: NotificationId
        }).populate({ path: "owner", model: "user" });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }

        const finalNotificationEdit = await Notification.findOneAndUpdate({ id: NotificationId }, { body: req.body.body, title: req.body.title })
        res.status(StatusCodes.OK).json(finalNotificationEdit);
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
}
    ;
const adminDeleteSingleNotification = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const NotificationId = req.params.id
        const singleNotification = await Notification.findOneAndRemove({
            id: NotificationId
        });
        if (!singleNotification) {
            throw new NotFound(
                `no Notification with id ${NotificationId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json({ message: "Deleted" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};



module.exports = { getNotifications, deleteMultipleNotification, deleteSingleNotification, getSingleNotification, adminAddNotification, adminGetNotifications, adminGetSingleNotification, adminDeleteSingleNotification, adminEditSingleNotification }