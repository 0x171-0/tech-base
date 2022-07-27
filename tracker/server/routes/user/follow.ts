const router = require('express').Router()
import Follow from '../../controller/user/follow'
import { isAuth } from '../../middleWares/authorization'

router.route('/user/follow').post(isAuth, Follow.follow)
router.route('/user/follow').get(isAuth, Follow.getFollow)
router.route('/user/follow').delete(isAuth, Follow.deleteFollow)

module.exports = router
