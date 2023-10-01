require("dotenv").config();
require("express-async-errors");
const morgan = require('morgan')
const express = require("express");
const app = express();
const path = require('path')
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");
const docs = require('./docs');
app.use(express.static('./public'))
const mongoose = require('mongoose')
//ADMIN
const connect = require('connect-pg-simple')
const session = require('express-session')
const UserSchema = require('./models/UserModel')


app.use(morgan('dev'))
//auth middlewares
const auth = require("./middleware/authentication");
const adminAuthMiddleware = require("./middleware/admin-auth");

//routes
const depositRoutes = require('./routes/depositR')
const notificationRoutes = require('./routes/notificationR')
const withdrawalRoutes = require('./routes/withdrawalR')
const loanRoutes = require('./routes/loanR')
const cardRoutes = require('./routes/cardR')
const investmentRoutes = require('./routes/investmentRoute')
const authRoutes = require("./routes/authRoute");
const uploadRoutes = require("./routes/uploadIdR")
const modifyUserRoutes = require('./routes/modifyUserR')
const adminAuth = require("./routes/adminAuth");
const adminRoutes = require('./routes/adminRoute')
const getUser = require('./routes/getUser')

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");

app.use(express.json());
// extra security packages
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 150, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "*"
}));
app.use(xss());

app.get("/test-upload-ruby", (req, res) => {
  res.render('index');
});

app.use('/public', express.static(path.join(__dirname, 'public')))

// routes
app.use("/auth", authRoutes);
app.use("/card", cardRoutes);
app.use("/invest", investmentRoutes);
app.use("/withdrawal", withdrawalRoutes);
app.use("/loan", loanRoutes);
app.use("/deposit", depositRoutes);
app.use("/notification", notificationRoutes);
app.use("/tokenized-user", getUser);
app.use("/upload", auth, uploadRoutes);
app.use("/auth", auth, modifyUserRoutes);
app.use("/admin/auth", adminAuth);
app.get('/', (req, res) => {
  res.json({ welcome: 'All about banking' })
})

app.use('/', adminAuthMiddleware, adminRoutes)
// app.use("/", adminAuthMiddleware, adminRoutes);
app.use(notFoundMiddleware);
// app.use()


const port = process.env.PORT || 3002;
//switch between local and cloud db

const local = process.env.LOCAL_URI;
const cloud = process.env.CLOUD_URI;
// const admin = new AdminJS({

// })
const start = async () => {
  try {
    await connectDB(local);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();