const { Withdrawal, paypalWithdrawal, skrillWithdrawal } = require("../models/WithdrawalM");
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addWithdrawal = async (req, res) => {
    try {

        if (req.body.amount * 1 !== req.body.amount) {
            throw new BadRequest('Amount has to be a number')
        }
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
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            throw new NotFound(`User ${req.decoded.name} not found`)
        }
        req.body.filterId = user.id
        req.body.filterName = user.name

        const newWithdrawal = await Withdrawal.create(req.body)
        const getPopulated = await Withdrawal.findOne({ _id: newWithdrawal._id });
        console.log(req.body.amount)
        res.status(StatusCodes.CREATED).json(getPopulated);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const addWithdrawalPaypal = async (req, res) => {
    try {

        if (req.body.amount * 1 !== req.body.amount) {
            throw new BadRequest('Amount has to be a number')
        }
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
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            throw new NotFound(`User ${req.decoded.name} not found`)
        }
        if (!user.userCanWithdrawPaypal) {
            throw new BadRequest(`Please contact customer support to proceed with this transaction`)
        }
        req.body.filterId = user.id
        req.body.filterName = user.name

        const newWithdrawal = await paypalWithdrawal.create(req.body)
        const getPopulated = await paypalWithdrawal.findOne({ _id: newWithdrawal._id });
        console.log(req.body.amount)
        res.status(StatusCodes.CREATED).json(getPopulated);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const addWithdrawalSkrill = async (req, res) => {
    try {

        if (req.body.amount * 1 !== req.body.amount) {
            throw new BadRequest('Amount has to be a number')
        }
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
        const user = await User.findOne({ _id: req.decoded.id })
        if (!user) {
            throw new NotFound(`User ${req.decoded.name} not found`)
        }
        req.body.filterId = user.id
        req.body.filterName = user.name
        if (!user.userCanWithdrawSkrill) {
            throw new BadRequest(`Please contact customer support to proceed with this transaction`)
        }
        const newWithdrawal = await skrillWithdrawal.create(req.body)
        const getPopulated = await skrillWithdrawal.findOne({ _id: newWithdrawal._id });
        console.log(req.body.amount)
        res.status(StatusCodes.CREATED).json(getPopulated);
    } catch (error) {
        console.log(error);
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getSingleWithdrawal = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const withdrawalId = req.params.id
        const ownerId = req.decoded.id;
        const singleWithdrawal = await Withdrawal.findOne({
            _id: withdrawalId,
            owner: ownerId,
        }).populate({ path: "owner", model: "user" });
        if (!singleWithdrawal) {
            throw new NotFound(
                `no transaction with id ${withdrawalId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleWithdrawal);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const getWithdrawals = async (req, res) => {
    try {
        //
        const getAllWithdrawals = async () => {
            const filter = { owner: req.decoded.id }
            const paypals = paypalWithdrawal.find(filter).sort('-createdAt').exec()
            const banks = Withdrawal.find(filter).sort('-createdAt').exec()
            const skrills = skrillWithdrawal.find(filter).sort('-createdAt').exec()
            const [results1, results2, results3] = await Promise.all([banks, skrills, paypals])
            const merged = [...results1, ...results2, ...results3].sort((a, b) =>
                b.createdAt - a.createdAt
            )
            return merged

        }

        getAllWithdrawals()
            .then(merged => {

                res.status(200).json({ allWithdrawals: merged })
            })
            .catch(error => {
                res.json({ message: error })
                console.error(error)
            })

        // //
        //         const ownerId = req.decoded.id;
        //         const allWithdrawals = await Withdrawal.find({ owner: ownerId });

        //         res
        //             .status(StatusCodes.OK)
        //             .json({ allWithdrawals });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};

const adminGetWithdrawals = async (req, res) => {
    try {
        // if (req.query.q) {
        //     const query = req.query.q
        //     const allWithdrawals = await Withdrawal.find({ filterName: { $regex: query, $options: 'i' } })
        //         .populate({ path: "owner", model: "user" })
        //         .sort({ createdAt: -1 })
        //     // .limit(Number(req.query._end))
        //     // .skip(Number(req.query._start))
        //     if (allWithdrawals.length < 1) {
        //         throw new NotFound("No transactions");
        //     }
        //     // res.set('Access-Control-Expose-Headers','X-Total-Count')
        //     // res.set('X-Total-Count',10)
        //     res
        //         .status(StatusCodes.OK)
        //         .json(allWithdrawals);
        //     return

        // }
        // if (req.query.userId) {
        //     const allWithdrawals = await Withdrawal.find({ filterId: req.query.userId })
        //         .populate({ path: "owner", model: "user" })
        //         .sort({ createdAt: -1 })
        //     // .limit(Number(req.query._end))
        //     // .skip(Number(req.query._start))
        //     if (allWithdrawals.length < 1) {
        //         throw new NotFound("No transactions");
        //     }
        //     // res.set('Access-Control-Expose-Headers','Content-Range')
        //     // res.set('X-Total-Count',10)
        //     // res.set('Content-Range',10)
        //     res
        //         .status(StatusCodes.OK)
        //         .json(allWithdrawals);
        //     return
        // }

        const getAllWithdrawals = async () => {
            // const filter = { owner: req.decoded.id }
            const paypals = paypalWithdrawal.find().populate({ path: "owner", model: "user" }).sort('-createdAt').exec()
            const banks = Withdrawal.find().populate({ path: "owner", model: "user" }).sort('-createdAt').exec()
            const skrills = skrillWithdrawal.find().populate({ path: "owner", model: "user" }).sort('-createdAt').exec()
            const [results1, results2, results3] = await Promise.all([banks, skrills, paypals])
            const merged = [...results1, ...results2, ...results3].sort((a, b) =>
                b.createdAt - a.createdAt
            )
            return merged

        }

        getAllWithdrawals()
            .then(merged => {
                res.status(200).json(merged)

            })
            .catch(error => {
                res.json({ message: error })
                console.error(error)
            })



        // const allWithdrawals = await Withdrawal.find({})
        //     .populate({ path: "owner", model: "user" })
        //     .sort({ createdAt: -1 })
        // // .limit(Number(req.query._end))
        // // .skip(Number(req.query._start))
        // if (allWithdrawals.length < 1) {
        //     throw new NotFound("No transactions");
        // }
        // // console.log(res.Access-Control-Expose-Headers)

        // res
        //     .status(StatusCodes.OK)
        //     .json(allWithdrawals);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
        console.log(error.message);
    }
};
const adminGetSingleWithdrawal = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const withdrawalId = req.params.id

        const singleWithdrawal = await Withdrawal.findOne({
            id: withdrawalId
        }).populate({ path: "owner", model: "user" }) ||
            await skrillWithdrawal.findOne({
                id: withdrawalId
            }).populate({ path: "owner", model: "user" }) ||
            await paypalWithdrawal.findOne({
                id: withdrawalId
            }).populate({ path: "owner", model: "user" })


        if (!singleWithdrawal) {
            throw new NotFound(
                `no transaction with id ${withdrawalId} for ${req.decoded.name}`
            );
        }
        res.status(StatusCodes.OK).json(singleWithdrawal);
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

const adminEditSingleWithdrawal = async (req, res) => {

    try {

        if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
            throw new BadRequest('Check Your Spelling')
        }
        if (!req.params.id) {
            throw new BadRequest("req.params cannot be empty")
        }
        const withdrawalId = req.params.id
        const singleWithdrawal = await Withdrawal.findOne({
            id: withdrawalId
        }).populate({ path: "owner", model: "user" }) ||
            await skrillWithdrawal.findOne({
                id: withdrawalId
            }).populate({ path: "owner", model: "user" }) ||
            await paypalWithdrawal.findOne({
                id: withdrawalId
            }).populate({ path: "owner", model: "user" })

        if (!singleWithdrawal) {
            throw new NotFound(
                `no transaction with id ${withdrawalId} for ${req.decoded.name}`
            );
        }
        if (singleWithdrawal.edited == true) {
            throw new BadRequest(`You ${singleWithdrawal.status} Withdrawal already!`)
        }
        if (req.body.status == 'approved') {
            // const finalTransactionEdit = await Withdrawal.findOneAndUpdate({ id: withdrawalId }, { status: "approved", edited: true, })
            singleWithdrawal.status = "approved"
            await singleWithdrawal.save()
            res.status(StatusCodes.OK).json(singleWithdrawal);
        }
        if (req.body.status == 'failed') {
            singleWithdrawal.status = "failed"
            await singleWithdrawal.save()
            res.status(StatusCodes.OK).json(singleWithdrawal);
        }
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};
const adminDeleteSingleWithdrawal = async (req, res) => {
    try {
        // if(!req.params.id){
        //     throw new BadRequest("req.params cannot be empty")
        // }
        // const withdrawalId = req.params.id
        // const singleWithdrawal = await Withdrawal.findOneAndRemove({
        //   id: withdrawalId
        // });
        // if (!singleWithdrawal) {
        //   throw new NotFound(
        //     `no transaction with id ${withdrawalId} for ${req.decoded.name}`
        //   );
        // }
        res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    }
};

module.exports = { addWithdrawal, addWithdrawalPaypal, addWithdrawalSkrill, getWithdrawals, getSingleWithdrawal, adminGetWithdrawals, adminGetSingleWithdrawal, adminDeleteSingleWithdrawal, adminEditSingleWithdrawal, }