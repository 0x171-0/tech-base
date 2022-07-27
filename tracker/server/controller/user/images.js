"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const config_1 = __importDefault(require("config"));
const images_1 = __importDefault(require("../../db/modules/user/images"));
const errorHandler_1 = require("../../middleWares/errorHandler");
const errorType_1 = require("../../infra/enums/errorType");
const path_1 = __importDefault(require("path"));
const logger_1 = __importDefault(require("../../utils/logger"));
const tag = 'controller/user/images';
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = new AWS.S3({
    accessKeyId: config_1.default.get('aws.s3.accessKeyId'),
    secretAccessKey: config_1.default.get('aws.s3.secretAccessKey'),
    Bucket: config_1.default.get('aws.s3.bucket'),
});
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: config_1.default.get('aws.s3.userImagesFolder'),
        acl: 'public-read',
        key: function (req, file, cb) {
            const { userId, randomNum } = req.body;
            cb(null, `${userId}_${randomNum}${path_1.default.extname(file.originalname)}`);
        },
    }),
});
class Images {
    constructor() {
        this.usUpload = upload.fields([
            {
                name: 'userImage',
                maxCount: 1,
            },
        ]);
        this.uploadImage = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const _tag = '/uploadImage';
            try {
                const { randomNum } = req.body;
                // @ts-ignore
                const fileName = req.files.userImage[0].originalname;
                const newImg = `${req.me.id}_${randomNum}${path_1.default.extname(fileName)}`;
                const upload = yield images_1.default.uploadImage(req.me.id, newImg);
                if (upload.error) {
                    throw new errorHandler_1.ErrorHandler(403, errorType_1.ErrorType.DatabaseError, upload.error);
                }
                res.status(200).send({
                    result: 'success',
                    data: upload,
                });
            }
            catch (error) {
                logger_1.default.error({
                    tag: tag + _tag,
                    error,
                });
                next(error);
            }
        });
    }
}
module.exports = new Images();
