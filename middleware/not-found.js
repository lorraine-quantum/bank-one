const notFound = (req, res, next) => {
    res.status(404).json({ message: 'Route does not exist' })
}
module.exports = notFound
