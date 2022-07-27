"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const follow_1 = __importDefault(require("../../controller/user/follow"));
const authorization_1 = require("../../middleWares/authorization");
router.route('/user/follow').post(authorization_1.isAuth, follow_1.default.follow);
router.route('/user/follow').get(authorization_1.isAuth, follow_1.default.getFollow);
router.route('/user/follow').delete(authorization_1.isAuth, follow_1.default.deleteFollow);
module.exports = router;
