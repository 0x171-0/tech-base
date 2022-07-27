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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const init_1 = require("./db/init");
const index_1 = require("./crawler/index");
const logger_1 = __importDefault(require("./utils/logger"));
const env = process.env.NODE_ENV || 'development';
const express = require('express');
const app = express();
const errorHandler_1 = require("./utils/middlewares/errorHandler");
const nlp_1 = require("./nlp/nlp");
const nlp = new nlp_1.NLP();
const server = app.listen(config_1.default.get('port'), () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`--- [ ENV : ${env}]  ---`);
        console.log(`--- Crawl server running on port ${config_1.default.get('port')} ---`);
        yield init_1.initTechBaseDb();
        yield index_1.crawlAndSaveAllSource();
        return;
        // const job = new CronJob(
        // 	'0 9,18,23 * * *',
        // 	crawlAndSaveAllSource,
        // 	null,
        // 	true,
        // 	'Asia/Taipei'
        // )
        // job.start()
    }
    catch (error) {
        console.log(error);
    }
}));
app.use(errorHandler_1.handleError);
function terminate(server, options = { coredump: false, timeout: 500 }) {
    return (code, reason) => (err, promise) => __awaiter(this, void 0, void 0, function* () {
        const _exit = () => {
            options.coredump ? process.abort() : process.exit(code);
        };
        if (err && err instanceof Error) {
            logger_1.default.error({ tag: 'server', error: err });
        }
        server.close(_exit);
        yield init_1.disconnectDb();
        init_1.disconnectRedis();
        setTimeout(_exit, options.timeout).unref();
    });
}
const exitHandler = terminate(server, {
    coredump: false,
    timeout: 500,
});
process.on('uncaughtException', exitHandler(1, 'Unexpected Error'));
process.on('unhandledRejection', exitHandler(1, 'Unhandled Promise'));
process.on('SIGTERM', exitHandler(0, 'SIGTERM'));
process.on('SIGINT', exitHandler(0, 'SIGINT'));
process.setMaxListeners(0);
module.exports = {
    app,
    server,
};
