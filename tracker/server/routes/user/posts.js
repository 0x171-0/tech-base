"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const posts_1 = __importDefault(require("../../controller/user/posts"));
const authorization_1 = require("../../middleWares/authorization");
router.route('/user/posts').get(authorization_1.isAuth, posts_1.default.getPosts);
router.route('/user/posts').post(authorization_1.isAuth, posts_1.default.addPost);
router.route('/user/posts').delete(authorization_1.isAuth, posts_1.default.deletePost);
router.route('/user/postFold').delete(authorization_1.isAuth, posts_1.default.deletePostFold);
module.exports = router;
