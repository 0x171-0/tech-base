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
const logger_1 = __importDefault(require("./utils/logger"));
const path_1 = __importDefault(require("path"));
// import bodyParser from 'body-parser'
const errorHandler_1 = require("./middleWares/errorHandler");
const init_1 = require("./db/init");
const morgan_1 = __importDefault(require("morgan"));
const error_1 = __importDefault(require("./controller/error"));
const { socketIoInit } = require('./webSocket/index');
const env = process.env.NODE_ENV || 'development';
const express = require('express');
const app = express();
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const server = app.listen(config_1.default.get('port'));
        console.log(`--- [ ENV : ${env}]  ---`);
        console.log(`--- Tracker server running on port ${config_1.default.get('port')} ---`);
        yield socketIoInit(server);
        yield init_1.initTechBaseDb();
        const _exitHandler = terminate(server, {
            coredump: false,
            timeout: 500,
        });
        // app.use(
        // 	bodyParser.urlencoded({
        // 		extended: true,
        // 	}),
        // )
        // app.use(bodyParser.json())
        app.set('views', '../client');
        app.use(express.json());
        app.use(express.urlencoded());
        app.use(express.static(path_1.default.join(__dirname, '../client')));
        app.use((req, res, next) => {
            var originalSend = res.send;
            res.send = function (body) {
                res.__body_response = body;
                originalSend.call(this, body);
            };
            next();
        });
        morgan_1.default.token('accessLog', (tokens, req, res) => {
            return [
                tokens.method(req, res),
                tokens.url(req, res),
                tokens.status(req, res),
                '-',
                tokens['response-time'](req, res),
                'ms',
                '\nrequest: ' + JSON.stringify(req.body),
            ].join(' ');
        });
        // @ts-ignore
        app.use(morgan_1.default('accessLog', { stream: logger_1.default.stream }));
        // API routes
        app.use('/api/' + config_1.default.get('api.version'), [
            require('./routes/user/follow'),
            require('./routes/user/bookmarks'),
            require('./routes/user/history'),
            require('./routes/user/images'),
            require('./routes/user/posts'),
            require('./routes/user/users'),
            require('./routes/user/watchLater'),
            require('./routes/news'),
        ]);
        app.use(error_1.default.get404);
        app.use(errorHandler_1.handleError);
        process.on('uncaughtException', _exitHandler(1, 'Unexpected Error'));
        process.on('unhandledRejection', _exitHandler(1, 'Unhandled Promise'));
        process.on('SIGTERM', _exitHandler(0, 'SIGTERM'));
        process.on('SIGINT', _exitHandler(0, 'SIGINT'));
    }
    catch (error) {
        console.log(error);
    }
});
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
initServer();
module.exports = {
    app,
};
