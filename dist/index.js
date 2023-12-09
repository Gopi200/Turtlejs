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
exports.savedconn = void 0;
const ws_1 = require("ws");
const turtle_1 = __importDefault(require("./turtle"));
const fs_1 = __importDefault(require("fs"));
const slurs = ["Asshole", "Baboon", "Chinky", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"];
const connectionsjson = __importStar(require("./turtles.json"));
var connections = {};
for (const key of Object.keys(connectionsjson)) {
    connections[key] = new turtle_1.default();
    Object.setPrototypeOf(connections[key], turtle_1.default.prototype);
}
delete connections["default"];
exports.savedconn = {};
function add_connection(label, turt) {
    connections[label] = turt;
    for (const key of Object.keys(connections)) {
        const _a = eval(`connections.${key}`), { ws } = _a, turtn = __rest(_a, ["ws"]);
        exports.savedconn[key] = turtn;
    }
    fs_1.default.writeFile(__dirname + "/turtles.json", JSON.stringify(exports.savedconn), (err) => {
        if (err) {
            console.log(err);
        }
    });
    return label;
}
class TurtleServer {
    constructor(port) {
        this.wss = new ws_1.WebSocketServer({ port });
        this.wss.on('connection', function connection(ws) {
            ws.on('message', function message(data) {
                let datal = data.toString().split("\n");
                console.log(datal);
                switch (datal[0]) {
                    case "No label":
                        ws.send(`func-None\nos.setComputerLabel(\"${add_connection(slurs[Object.keys(connections).length % slurs.length] + Math.floor(Object.keys(connections).length / slurs.length), new turtle_1.default(ws))}\")`);
                        break;
                    case "label":
                        connections[datal[1]].ws = ws;
                        break;
                    default:
                        connections[datal[0]].returned = datal[1];
                        break;
                }
            });
            ws.on('error', console.error);
        });
    }
}
exports.default = TurtleServer;
console.log("Server up");
