"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Device = void 0;
const getmac_1 = __importDefault(require("getmac"));
class Device {
    constructor(id, displayName) {
        this.displayName = null;
        this.timestamp = 0;
        this.id = id;
        this.mac = getmac_1.default();
        this.displayName = displayName;
    }
}
exports.Device = Device;
