const Deposit = require("../models/DepositM");
const Withdrawal = require("../models/WithdrawalM");
const { uploadId } = require('./uploadIdC')
const User = require("../models/UserModel")
const { v4: uuidv4 } = require('uuid');
const { StatusCodes } = require("http-status-codes");
const { BadRequest, NotFound } = require("../errors/customErrors");
let uniqueId = 0
const addDeposit = async (req, res) => {

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
    const user = await User.findOne({ _id: req.decoded.id })
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "user not found" })
    }
    req.body.filterId = user.id
    req.body.filterName = user.name
    // await User.findOneAndUpdate({ _id: req.decoded.id }, { pendBalance: user.pendBalance + req.body.amount }, { new: true })
    const newDeposit = await Deposit.create(req.body)
    const getPopulated = await Deposit.findOne({ _id: newDeposit._id }).populate({ path: "owner", model: "user" });

    // upload image
    uploadId(req, res, async (err) => {
      try {

        if (!req.body.amount) {
          throw new BadRequest('Amount not supplied')
        }

        if (!req.body.via) {
          throw new BadRequest('Deposit means not supplied')
        }

        req.body.amount = Number(req.body.amount)
        if (req.body.amount * 1 !== req.body.amount) {
          throw new BadRequest('Amount has to be a number')
        }
        if (req.fileValidationError) {
          return res.json({ message: req.fileValidationError })
        }
        if (!req.file) {
          await Deposit.findOneAndRemove({ id: newDeposit.id })
          throw new BadRequest('File cannot be empty')
        }
        if (err) {
          return res.status(StatusCodes.BAD_REQUEST).json({ msg: err })
        }
        else {
          console.log(req.file.filename, "filename")

          const apiBaseUrl = `${req.protocol}://${req.get('host')}`
          const imageUrl = `${apiBaseUrl}/public/uploads/${req.file.filename}`
          const updatedDeposit = await Deposit.findOneAndUpdate({ id: newDeposit.id }, { imageUrl, amount: req.body.amount, via: req.body.via }, { new: true })
          const { via, amount } = updatedDeposit
          console.log(updatedDeposit.imageUrl, via, amount);
          res.json({ redirecturl: `${apiBaseUrl}/public/uploads/${req.file.filename}` })
          // return res.redirect(`${apiBaseUrl}/public/uploads/${req.file.filename}`)
        }
      }
      catch (err) {
        console.log(err.message);
        return res.status(StatusCodes.BAD_REQUEST).json({ err: err.message })
      }
    })
    // res.status(StatusCodes.CREATED).json({ message: `${req.decoded.name} added ${req.body.amount} units of currency via ${req.body.via}` });
    // console.log(req.decoded.name)
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const adminAddDeposit = async (req, res) => {

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

    const newDeposit = await Deposit.create(req.body)
    const getPopulated = await Deposit.findOne({ _id: newDeposit._id }).populate({ path: "owner", model: "user" });


    res.status(StatusCodes.CREATED).json(getPopulated);
    // console.log(req.decoded.name)
  } catch (error) {
    console.log(error.message);
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const getUser = async (req, res) => {
  try {
    const ownerId = req.decoded.id;
    const user = await User.findOne(
      {
        _id: ownerId,
      }
    );
    if (!user) {
      throw new NotFound(
        `user not found`
      );
    }
    return res.status(StatusCodes.OK).
      json({
        owner: user.name,
        email: user.email,
        accountType: user.accountType,
        phoneNumber: user.phoneNumber,
        accountNumber: user.accountNumber,
        tier: user.tier,
        otp: user.otp,
        otpLevel: user.otpLevel,
        otp: user.otp,
        otpMessage: user.otpMessage,
        country: user.country,
        region: user.region,
        profit: user.totalProfit,
        totalBalance: user.totalEquity,
        totalDeposit: user.totalDeposit,
        usdtAddress: user.usdtAddress,
        dogeAddress: user.dogeAddress,
        bitcoinAddress: user.bitcoinAddress,
        ethereumAddress: user.ethereumAddress
      });
  }
  catch (error) {
    console.log(error)
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message })
  }
};
const getSingleDeposit = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const DepositId = req.params.id
    const ownerId = req.decoded.id;
    const singleDeposit = await Deposit.findOne({
      _id: DepositId,
      owner: ownerId,
    }).populate({ path: "owner", model: "user" });
    if (!singleDeposit) {
      throw new NotFound(
        `no Deposit with id ${DepositId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleDeposit);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const getDeposits = async (req, res) => {
  try {
    const ownerId = req.decoded.id;
    const allDeposits = await Deposit.find({ owner: ownerId }).sort({ createdAt: "-1" });
    res
      .status(StatusCodes.OK)
      .json({ allDeposits });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetDeposits = async (req, res) => {
  try {
    // res.set('Access-Control-Expose-Headers','Content-Range')
    // res.set('X-Total-Count',10)
    // res.set('Content-Range',10)
    if (req.query.q) {
      // const user = await User.findOne({})  
      const query = req.query.q
      const allDeposits = await Deposit.find({ filterName: { $regex: query, $options: 'i' } })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (allDeposits.length < 1) {
        throw new NotFound("No Deposits");
      }
      // res.set('Access-Control-Expose-Headers','X-Total-Count')
      // res.set('X-Total-Count',10)
      res
        .status(StatusCodes.OK)
        .json(allDeposits);
      return

    }
    if (req.query.userId) {
      const allDeposits = await Deposit.find({ filterId: req.query.userId })
        .populate({ path: "owner", model: "user" })
        .sort({ createdAt: -1 })
      // .limit(Number(req.query._end))
      // .skip(Number(req.query._start))
      if (allDeposits.length < 1) {
        throw new NotFound("No Deposits");
      }
      // res.set('Access-Control-Expose-Headers','Content-Range')
      // res.set('X-Total-Count',10)
      // res.set('Content-Range',10)
      res
        .status(StatusCodes.OK)
        .json(allDeposits);
      return
    }
    const allDeposits = await Deposit.find({})
      .populate({ path: "owner", model: "user" })
      .sort({ createdAt: -1 })
    // .limit(Number(req.query._end))
    // .skip(Number(req.query._start))
    if (allDeposits.length < 1) {
      throw new NotFound("No Deposits");
    }
    // console.log(res.Access-Control-Expose-Headers)

    res
      .status(StatusCodes.OK)
      .json(allDeposits);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
    console.log(error.message);
  }
};
const adminGetSingleDeposit = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const DepositId = req.params.id
    const singleDeposit = await Deposit.findOne({
      id: DepositId
    }).populate({ path: "owner", model: "user" });
    if (!singleDeposit) {
      throw new NotFound(
        `no Deposit with id ${DepositId} for ${req.decoded.name}`
      );
    }
    res.status(StatusCodes.OK).json(singleDeposit);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

const adminEditSingleDeposit = async (req, res) => {
  try {
    if (req.body.status !== 'approved' && req.body.status !== 'pending' && req.body.status !== 'failed') {
      throw new BadRequest('Check Your Spelling')
    }
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const DepositId = req.params.id
    const singleDeposit = await Deposit.findOne({
      id: DepositId
    }).populate({ path: "owner", model: "user" });
    if (!singleDeposit) {
      throw new NotFound(
        `no Deposit with id ${DepositId} for ${req.decoded.name}`
      );
    }
    if (singleDeposit.edited == true) {
      throw new BadRequest(`You ${singleDeposit.status} Deposit already!`)
    }
    // console.log(req.body.status)
    if (req.body.status == 'approved') {

      const finalDepositEdit = await Deposit.findOneAndUpdate({ id: DepositId }, { status: "approved", edited: true })
      res.status(StatusCodes.OK).json(finalDepositEdit);
    }
    if (req.body.status == 'failed') {
      await User.findOneAndUpdate(
        { email: singleDeposit.owner.email },
        {
          pendBalance: singleDeposit.owner.pendBalance - singleDeposit.amount
        },
        { new: true })
      const finalDepositEdit = await Deposit.findOneAndUpdate({ id: DepositId }, { status: "failed", edited: true })
      res.status(StatusCodes.OK).json(finalDepositEdit);
    }
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
}
  ;
const adminDeleteSingleDeposit = async (req, res) => {
  try {
    // if(!req.params.id){
    //     throw new BadRequest("req.params cannot be empty")
    // }
    // const DepositId = req.params.id
    // const singleDeposit = await Deposit.findOneAndRemove({
    //   id: DepositId
    // });
    // if (!singleDeposit) {
    //   throw new NotFound(
    //     `no Deposit with id ${DepositId} for ${req.decoded.name}`
    //   );
    // }
    res.status(StatusCodes.OK).json({ message: "You cannot Delete Records" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};
const adminDeleteSingleUser = async (req, res) => {
  try {
    if (!req.params.id) {
      throw new BadRequest("req.params cannot be empty")
    }
    const userId = req.params.id
    const singleUser = await User.findOneAndRemove({
      id: userId
    });
    if (singleUser) {
      await Deposit.deleteMany({ filterId: userId })
      await Withdrawal.deleteMany({ filterId: userId })
    }
    if (!singleUser) {
      throw new NotFound(
        `no Deposit with id ${userId} }`
      );
    }

    res.status(StatusCodes.OK).json({ message: "deleted" });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};


module.exports = { addDeposit, getDeposits, getUser, getSingleDeposit, adminAddDeposit, adminGetDeposits, adminGetSingleDeposit, adminDeleteSingleDeposit, adminEditSingleDeposit, adminDeleteSingleUser }