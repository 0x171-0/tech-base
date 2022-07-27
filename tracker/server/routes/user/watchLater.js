"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authorization_1 = require("../../middleWares/authorization");
const router = require('express').Router();
const watchLater_1 = __importDefault(require("../../controller/user/watchLater"));
router.route('/user/watchLater').get(authorization_1.isAuth, watchLater_1.default.getWatchLater);
router.route('/user/watchLater').post(authorization_1.isAuth, watchLater_1.default.addWatchLater);
router.route('/user/watchLater').delete(authorization_1.isAuth, watchLater_1.default.deleteWatchLater);
module.exports = router;
