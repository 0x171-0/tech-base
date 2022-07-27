import { isAuth } from '../../middleWares/authorization'
const router = require('express').Router()
import watchLater from '../../controller/user/watchLater'

router.route('/user/watchLater').get(isAuth, watchLater.getWatchLater)
router.route('/user/watchLater').post(isAuth, watchLater.addWatchLater)
router.route('/user/watchLater').delete(isAuth, watchLater.deleteWatchLater)

module.exports = router
