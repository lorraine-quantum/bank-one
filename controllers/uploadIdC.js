const multer = require('multer')
const path = require('path')
const { BadRequest } = require('../errors/customErrors')

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.decoded.name.replace(" ", "") + Date.now() + path.extname(file.originalname))
    }
})

const multerFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith('image')) {
        console.log(file.mimetype)
        req.fileValidationError = `${file.mimetype} not allowed, upload only images`
        return cb((`${file.mimetype} not allowed, upload only images`), false);
    } else {
        cb(null, true);
    }
};
const uploadId = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: multerFilter
}).single('file')





module.exports = { uploadId }