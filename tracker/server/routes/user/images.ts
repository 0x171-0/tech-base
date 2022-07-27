import Image from '../../controller/user/images'
const router = require('express').Router()

router.route('/user/uploadImage').post(Image.usUpload, Image.uploadImage)

module.exports = router
