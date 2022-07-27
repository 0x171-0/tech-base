"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router = require('express').Router();
const history_1 = __importDefault(require("../../controller/user/history"));
const authorization_1 = require("../../middleWares/authorization");
router.route('/user/history').post(authorization_1.isAuth, history_1.default.addHistory);
router.route('/user/getHistory').get(authorization_1.isAuth, history_1.default.getHistory);
router.route('/user/history').delete(authorization_1.isAuth, history_1.default.deleteHistory);
module.exports = router;
