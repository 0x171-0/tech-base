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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsModule = void 0;
const NewsModel_1 = require("../models/NewsModel");
/**
 * The NewsModule db service
 * @class
 */
class NewsModule {
    constructor() {
        /**
         * @param {string} title
         */
        this.searchByTitle = (title) => __awaiter(this, void 0, void 0, function* () {
            return (yield NewsModel_1.NewsModel.find({
                title: title,
            }, {}))[0];
        });
        /**
        * @abstract
        * @param {string} href
        * @return {NewsModel}
        */
        this.searchByHref = (href) => __awaiter(this, void 0, void 0, function* () {
            return (yield NewsModel_1.NewsModel.find({
                href: href,
            }, {}))[0];
        });
    }
}
exports.NewsModule = NewsModule;
