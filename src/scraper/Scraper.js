"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Scraper {
    get(url, params) {
        return axios_1.default.get('http://dblp.org/search/publ/api', { params: params });
    }
}
exports.Scraper = Scraper;
