"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketIoInit = exports.io = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
const comments_1 = __importDefault(require("../db/modules/user/comments"));
const socketIoInit = (server) => {
    try {
        // @ts-ignore
        exports.io = socket_io_1.default(server);
        console.log(`--- WebSocket Connected ---`);
        const onConnection = (socket) => {
            socket.on('heartbeat', () => {
                console.log('TackBase webSocket is connected ... ');
            });
        };
        exports.io.on('connection', onConnection);
        exports.io.on('connect', (socket) => {
            socket.on('postNewsComment', ({ userId, userName, contentId, comment, date, picture }) => {
                comments_1.default.saveComment(userId, userName, contentId, comment, date, picture);
            });
        });
    }
    catch (error) {
        throw error;
    }
};
exports.socketIoInit = socketIoInit;
