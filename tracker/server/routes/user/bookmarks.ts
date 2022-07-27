import { isAuth } from '../../middleWares/authorization'
const router = require('express').Router()
import Bookmark from '../../controller/user/bookmarks'
router.route('/user/bookmarks').get(isAuth, Bookmark.getBookmarks)
router.route('/user/bookmarks').post(isAuth, Bookmark.addBookmark)
router.route('/user/bookmarks').delete(isAuth, Bookmark.deleteBookmark)
router.route('/user/bookFold').delete(isAuth, Bookmark.deleteBookFold)

module.exports = router
