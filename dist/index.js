"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const turtle_1 = __importDefault(require("./turtle"));
const defaults_1 = require("./defaults");
__exportStar(require("./defaults"), exports);
const fs_1 = __importDefault(require("fs"));
const slurs = ["Asshole", "Baboon", "Clown", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"];
try {
    fs_1.default.mkdirSync("./data");
}
catch (_a) { }
try {
    fs_1.default.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' }, (err) => {
        if (err) {
            console.log(err);
        }
    });
}
catch (_b) { }
class TurtleServer {
    add_connection(label, turt) {
        this.connections[label] = turt;
        const _a = this.connections[label], { ws } = _a, turtn = __rest(_a, ["ws"]);
        this.savedconn[label] = turtn;
        fs_1.default.writeFile("./data/turtles.json", JSON.stringify(this.savedconn), (err) => {
            if (err) {
                console.log(err);
            }
        });
        return label;
    }
    message(data, ws) {
        let datal = data.toString().split("\n");
        console.log(datal);
        switch (datal[0]) {
            case "No label":
                ws.send(this.add_connection(slurs[Object.keys(this.connections).length % slurs.length] + Math.floor(Object.keys(this.connections).length / slurs.length), new turtle_1.default(ws, datal[1].split(" ").map(function (val, i) { if (i < 3) {
                    return +val;
                }
                else {
                    return val;
                } }))));
                break;
            case "label":
                this.connections[datal[1]].ws = ws;
                (0, defaults_1.getInventory)(this.connections[datal[1]]);
                break;
            case "status":
                this.connections[datal[1]].status = datal[2];
                break;
            default:
                this.connections[datal[0]].returned.push(datal[1]);
                break;
        }
    }
    connection(ws) {
        ws.on('message', (data) => this.message(data, ws));
    }
    constructor(port) {
        this.savedconn = {};
        this.wss = new ws_1.WebSocketServer({ port });
        try {
            this.connections = JSON.parse(fs_1.default.readFileSync("./data/turtles.json", "utf-8"), (key, value) => { if (key != "returned") {
                Object.setPrototypeOf(value, turtle_1.default.prototype);
            } ; return value; });
        }
        catch (err) {
            console.error(err);
        }
        for (const key of Object.keys(this.connections)) {
            const _a = this.connections[key], { ws } = _a, turtn = __rest(_a, ["ws"]);
            this.savedconn[key] = turtn;
        }
        this.wss.on('connection', (ws) => this.connection(ws));
    }
}
exports.default = TurtleServer;
