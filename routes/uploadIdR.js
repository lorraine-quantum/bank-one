const route = require('express').Router()
const { uploadId } = require('../controllers/uploadIdC')
// const User = require('../models/UserModel')


route.post('/', (req, res) => {
    uploadId(req, res, (err) => {
        console.log("error:", req.fileValidationError);
        if (req.fileValidationError) {
            //  return   res.redirect('/uploadfailed')
            // console.log(req.fileValidationError)
            return res.json({ message: req.fileValidationError })
        }
        if (!req.file) {
            return res.json({ msg: "file cannot be empty" })
        }
        if (err) {
            return res.json({ msg: err })
        }
        else {
            console.log(req.file.filename, "filename")
            const apiBaseUrl = `${req.protocol}://${req.get('host')}`
            console.log(`${apiBaseUrl}/public/uploads/${req.file.filename}`);
            res.json({ redirecturl: `${apiBaseUrl}/public/uploads/${req.file.filename}` })
            // return res.redirect(`${apiBaseUrl}/public/uploads/${req.file.filename}`)
        }
    })
})




// route.post('/', uploadId.single('file'), (req, res) => {
//     console.log(req.file)
//     res.json({ message: "success" })
// })

module.exports = route