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
const ws_1 = require("ws");
const turtle_1 = __importDefault(require("./turtle"));
__exportStar(require("./defaults"), exports);
const fs_1 = __importDefault(require("fs"));
const node_json_db_1 = require("node-json-db");
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
function omit(obj, key) {
    const o = Object.assign({}, obj);
    delete o[key];
    return o;
}
class TurtleServer {
    message(data, ws) {
        let datal = data.toString().split("\n");
        console.log(datal);
        switch (datal[0]) {
            case "No label":
                (function (server) {
                    return __awaiter(this, void 0, void 0, function* () {
                        let l = Object.keys(yield server.turtledb.getData("/")).length;
                        let label = slurs[l % slurs.length] + Math.floor(l / slurs.length);
                        ws.send(label);
                        let data = omit(JSON.parse(datal[1]), "URL");
                        data.inventory = JSON.parse(datal[2]);
                        data.status = ["Waiting", ""];
                        server.turtledb.push("/" + label, data);
                    });
                })(this);
                break;
            case "label":
                this.connections[datal[1]] = new turtle_1.default(ws, (timeout) => __awaiter(this, void 0, void 0, function* () { return this.statusawaiter(datal[1], timeout); }), () => __awaiter(this, void 0, void 0, function* () { return this.getStatus(datal[1]); }));
                break;
            case "status":
                this.turtledb.push(`/${datal[1]}/status`, [datal[2], "new"]);
                break;
            case "update":
                this.turtledb.push(`/${datal[1]}/${datal[2]}`, JSON.parse(datal[3])[0]);
                break;
            case "error":
                this.connections[datal[1]].error = datal[2];
                break;
            default:
                this.connections[datal[0]].returned.push(datal[1]);
                break;
        }
    }
    connection(ws) {
        ws.on('message', (data) => this.message(data, ws));
    }
    getInventory(label) {
        return __awaiter(this, void 0, void 0, function* () { return this.turtledb.getData(`/${label}/inventory`); });
    }
    getEquipment(label) {
        return __awaiter(this, void 0, void 0, function* () { return this.turtledb.getData(`/${label}/equipment`); });
    }
    getLocation(label) {
        return __awaiter(this, void 0, void 0, function* () { let turtledata = yield this.turtledb.getData(`/${label}`); return [turtledata.x, turtledata.y, turtledata.z, turtledata.facing]; });
    }
    getStatus(label) {
        return __awaiter(this, void 0, void 0, function* () { return this.turtledb.getData(`/${label}/status[0]`); });
    }
    statusawaiter(label, timeout_iteration) {
        return __awaiter(this, void 0, void 0, function* () {
            var timed_out = false;
            var waitingit = 0;
            while ((yield this.turtledb.getData(`/${label}/status[1]`)) == "") {
                if (timeout_iteration) {
                    if (waitingit > timeout_iteration) {
                        timed_out = true;
                        break;
                    }
                }
                yield new Promise(resolve => setTimeout(resolve, 100));
                waitingit += 1;
            }
            if (timed_out) {
                return "Timed out";
            }
            else {
                this.turtledb.push(`/${label}/status[1]`, "");
                return this.getStatus(label);
            }
        });
    }
    constructor(port) {
        this.turtledb = new node_json_db_1.JsonDB(new node_json_db_1.Config("./data/turtles.json", true, false, "/"));
        this.connections = {};
        this.wss = new ws_1.WebSocketServer({ port });
        this.wss.on('connection', (ws) => this.connection(ws));
    }
}
exports.default = TurtleServer;
