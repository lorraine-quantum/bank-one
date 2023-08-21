const route = require('express').Router()
const { uploadId } = require('../controllers/uploadIdC')
route.post('/', (req, res) => {
    uploadId(req, res, (err) => {
        console.log(req.file)
        if (req.fileValidationError) {
            //  return   res.redirect('/uploadfailed')
            console.log(req.fileValidationError)
            return res.json({ message: req.fileValidationError })
        }
        if (!req.file) {
            return res.json({ msg: "file cannot be empty" })
        }
        if (err) {
            return res.json({ msg: err })
        }
        else {
            console.log(req.file)
            return res.json({ message: ' Image Uploaded successful' })
        }
    })
})




// route.post('/', uploadId.single('file'), (req, res) => {
//     console.log(req.file)
//     res.json({ message: "success" })
// })

module.exports = route