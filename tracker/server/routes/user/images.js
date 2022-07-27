"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const images_1 = __importDefault(require("../../controller/user/images"));
const router = require('express').Router();
router.route('/user/uploadImage').post(images_1.default.usUpload, images_1.default.uploadImage);
module.exports = router;
