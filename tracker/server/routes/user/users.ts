import { isAuth } from '../../middleWares/authorization'
import User from '../../controller/user/users'
const router = require('express').Router()

router.route('/user/signUp').post(User.signUp)
router.route('/user/signIn').post(User.signIn)

router.route('/user/profile').get(isAuth, User.getUserProfile)
router.route('/user/folders').get(isAuth, User.getFolders)
router.route('/user/public').get(User.publicInfo)

module.exports = router
