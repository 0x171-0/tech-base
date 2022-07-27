const router = require('express').Router()
import Post from '../../controller/user/posts'
import { isAuth } from '../../middleWares/authorization'

router.route('/user/posts').get(isAuth, Post.getPosts)
router.route('/user/posts').post(isAuth, Post.addPost)
router.route('/user/posts').delete(isAuth, Post.deletePost)
router.route('/user/postFold').delete(isAuth, Post.deletePostFold)

module.exports = router
