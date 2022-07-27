"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../../middleWares/authorization");
const router = require('express').Router();
const bookmarks_1 = __importDefault(require("../../controller/user/bookmarks"));
router.route('/user/bookmarks').get(authorization_1.isAuth, bookmarks_1.default.getBookmarks);
router.route('/user/bookmarks').post(authorization_1.isAuth, bookmarks_1.default.addBookmark);
router.route('/user/bookmarks').delete(authorization_1.isAuth, bookmarks_1.default.deleteBookmark);
router.route('/user/bookFold').delete(authorization_1.isAuth, bookmarks_1.default.deleteBookFold);
module.exports = router;
