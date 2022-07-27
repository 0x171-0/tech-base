"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../../middleWares/authorization");
const users_1 = __importDefault(require("../../controller/user/users"));
const router = require('express').Router();
router.route('/user/signUp').post(users_1.default.signUp);
router.route('/user/signIn').post(users_1.default.signIn);
router.route('/user/profile').get(authorization_1.isAuth, users_1.default.getUserProfile);
router.route('/user/folders').get(authorization_1.isAuth, users_1.default.getFolders);
router.route('/user/public').get(users_1.default.publicInfo);
module.exports = router;
