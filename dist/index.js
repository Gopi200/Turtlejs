"use strict";
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
const fs_1 = __importDefault(require("fs"));
const slurs = ["Asshole", "Baboon", "Chinky", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"];
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
                ws.send(`func-None\nos.setComputerLabel(\"${this.add_connection(slurs[Object.keys(this.connections).length % slurs.length] + Math.floor(Object.keys(this.connections).length / slurs.length), new turtle_1.default(ws))}\")`);
                break;
            case "label":
                this.connections[datal[1]].ws = ws;
                break;
            default:
                this.connections[datal[0]].returned = datal[1];
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
            this.connections = JSON.parse(fs_1.default.readFileSync("./data/turtles.json", "utf-8"), (key, value) => { Object.setPrototypeOf(value, turtle_1.default.prototype); return value; });
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
