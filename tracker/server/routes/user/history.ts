const router = require('express').Router()
import History from '../../controller/user/history'
import { isAuth } from '../../middleWares/authorization'
router.route('/user/history').post(isAuth, History.addHistory)
router.route('/user/getHistory').get(isAuth, History.getHistory)
router.route('/user/history').delete(isAuth, History.deleteHistory)

module.exports = router
