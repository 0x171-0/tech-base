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
const UserModel_1 = require("../db/models/UserModel");
const config_1 = __importDefault(require("config"));
const customErrors_1 = require("../infra/customErrors");
const crypto_1 = __importDefault(require("crypto"));
const UserRole_1 = require("../infra/enums/UserRole");
class TokenHelper {
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [identity, access_token] = (token || '').split(' ', 2);
                if (!identity)
                    throw new Error(customErrors_1.customErrors.AUTH_NO_IDENTITY.type);
                let email = '';
                const cipher = crypto_1.default.createDecipheriv('aes-128-cbc', config_1.default.get('token.key'), config_1.default.get('token.iv'));
                email += cipher.update(access_token, 'hex', 'utf8');
                email += cipher.final('utf8');
                const userPO = yield UserModel_1.UserModel.find({ email });
                return userPO[0];
            }
            catch (err) {
                throw err;
            }
        });
    }
    generateToken(opt) {
        try {
            const { email, loginAt = new Date(), role = UserRole_1.UserRole.user } = opt;
            let access_token = '';
            const cipher = crypto_1.default.createCipheriv('aes-128-cbc', config_1.default.get('token.key'), config_1.default.get('token.iv'));
            access_token += cipher.update(email, 'utf8', 'hex');
            access_token += cipher.final('hex');
            return role + ' ' + access_token;
        }
        catch (err) {
            throw err;
        }
    }
}
module.exports = new TokenHelper();
