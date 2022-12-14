"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectRedis = exports.redisClient = exports.disconnectDb = exports.initTechBaseDb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const asyncRedis = __importStar(require("async-redis"));
const logger_1 = __importDefault(require("../utils/logger"));
const tag = '/db/init';
const initTechBaseDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(config_1.default.get('db.url'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        const techBaseDbConn = mongoose_1.default.connection;
        yield techBaseDbConn.once('open', () => logger_1.default.info('--- Connected to Database --'));
        techBaseDbConn.on('error', (error) => console.error(error));
    }
    catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
exports.initTechBaseDb = initTechBaseDb;
const disconnectDb = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield mongoose_1.default.disconnect();
});
exports.disconnectDb = disconnectDb;
exports.redisClient = asyncRedis.createClient({
    host: String(config_1.default.get('redis.host')),
    port: Number(config_1.default.get('redis.port')),
    retry_strategy: function (options) {
        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 30) {
            return new Error('Retry time exhausted');
        }
        if (options.attempt > 10) {
            return undefined;
        }
        return Math.min(options.attempt * 100, 3000);
    },
});
const disconnectRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    exports.redisClient.quit();
});
exports.disconnectRedis = disconnectRedis;
exports.redisClient.on('error', (error) => {
    logger_1.default.error({
        tag,
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
});
exports.redisClient.on('ready', () => {
    logger_1.default.info({ tag, msg: `Redis ready on: ${process.env.NODE_ENV}` });
});
exports.redisClient.on('connect', () => {
    logger_1.default.info({ tag, msg: `Redis connected on: ${process.env.NODE_ENV}` });
});
