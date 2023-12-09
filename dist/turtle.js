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
class turtle {
    constructor(ws) {
        this.Huzzah = "Lamo";
        this.waitingit = 0;
        this.ws = ws;
    }
    receive() {
        return __awaiter(this, void 0, void 0, function* () {
            while (this.returned == undefined && this.waitingit < 50) {
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.waitingit += 1;
            }
            if (this.waitingit >= 50) {
                return "Nothing";
            }
            else {
                var temp = this.returned;
                this.returned = undefined;
                return temp;
            }
        });
    }
    craft(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.craft(${count})`);
            return yield this.receive();
        });
    }
    moveforward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.forward()");
            return yield this.receive();
        });
    }
    turnleft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.turnLeft()");
            return yield this.receive();
        });
    }
    turnright() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.turnRight()");
            return yield this.receive();
        });
    }
    getfuellevel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.getFuelLevel()");
            return yield this.receive();
        });
    }
    refuel(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.refuel(${count})`);
            return yield this.receive();
        });
    }
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspect()");
            return yield this.receive();
        });
    }
    inspectup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspectUp()");
            return yield this.receive();
        });
    }
    inspectdown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspectDown()");
            return yield this.receive();
        });
    }
}
exports.default = turtle;
