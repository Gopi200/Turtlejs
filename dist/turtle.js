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
const defaults_1 = require("./defaults");
class Turtle {
    constructor(ws, label) {
        this.returned = [];
        this.status = "";
        this.waitingit = 0;
        this.ws = ws;
        this.inventory = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/inventory`); });
        this.x = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/x`); });
        this.y = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/y`); });
        this.z = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/z`); });
        this.equipment = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/equipment`); });
        this.facing = (turtledb) => __awaiter(this, void 0, void 0, function* () { return turtledb.getData(`/${label}/facing`); });
    }
    receive(timeout_iteration) {
        return __awaiter(this, void 0, void 0, function* () {
            var timed_out = false;
            while (this.returned.length == 0) {
                if (timeout_iteration) {
                    if (this.waitingit > timeout_iteration) {
                        timed_out = true;
                        break;
                    }
                }
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.waitingit += 1;
            }
            var temp = [];
            this.waitingit = 0;
            if (timed_out) {
                return ["Timed out"];
            }
            else {
                temp = JSON.parse(this.returned[0]);
                this.returned.shift();
                return temp;
            }
        });
    }
    /**
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    craft(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.craft(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle forward one block.
    */
    moveForward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.forward()"));
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle back one block.
    */
    moveBackward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.back()"));
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle up one block.
    */
    moveUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.up()"));
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle down one block.
    */
    moveDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.down()"));
            return yield this.receive(50);
        });
    }
    /**
     * 	Rotate the turtle to the left by 90 degrees.
    */
    turnLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.turnLeft()"));
            return yield this.receive(50);
        });
    }
    /**
     * 	Rotate the turtle to the right by 90 degrees.
    */
    turnRight() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)("turtle.turnRight()"));
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block in front of the turtle.
    */
    digFront(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.dig(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block above the turtle.
    */
    digUp(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.digUp(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block below the turtle.
    */
    digDown(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.digDown(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeFront(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.place(${text})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeUp(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.placeUp(${text})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeDown(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.placeDown(${text})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    dropFront(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.drop(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    dropUp(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.dropUp(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    dropDown(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.dropDown(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * Change the currently selected slot.
    */
    select(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.select(${slot})`));
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of items in the specified slot (default selected)
    */
    getItemCount(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.getItemCount(${slot})`));
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    getItemSpace(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.getItemSpace(${slot})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block in front of the turtle.
    */
    detectFront() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.detect()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block above the turtle.
    */
    detectUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.detectUp()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block below the turtle.
    */
    detectDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.detectDown()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    compareFront() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.compare()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    compareUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.compareUp()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    compareDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.compareDown()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    attackFront(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.attack(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    attackUp(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.attackUp(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    attackDown(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.attackDown(${side})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    suckFront(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.suck(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    suckUp(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.suckUp(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    suckDown(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.suckDown(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of fuel this turtle currently holds
     */
    getFuelLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.getFuelLevel()`));
            return +(yield this.receive(50)).slice(1, -1);
        });
    }
    /**
     * Refuel this turtle
     */
    refuel(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.refuel(${count})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    compareTo(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.compareTo(${slot})`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Move a specified amount of items from the selected slot to another one.
    */
    transferTo(slot, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (count) {
                this.ws.send((0, defaults_1.sendresponse)(`turtle.transferTo(${slot}, ${count})`));
            }
            else {
                this.ws.send((0, defaults_1.sendresponse)(`turtle.transferTo(${slot})`));
            }
            return yield this.receive(50);
        });
    }
    /**
     * 	Get the currently selected slot.
    */
    getSelectedSlot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.getSelectedSlot()`));
            return yield this.receive();
        });
    }
    /**
     * 	Get the maximum amount of fuel this turtle can hold.
    */
    getFuelLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.getFuelLimit()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.equipLeft()`));
            var response = yield this.receive(50);
        });
    }
    /**
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipRight() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.equipRight()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectForward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.inspect()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Get information about the block above the turtle.
     */
    inspectUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.inspectUp()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send((0, defaults_1.sendresponse)(`turtle.inspectDown()`));
            return yield this.receive(50);
        });
    }
    /**
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    getItemDetail(slot, detailed) {
        return __awaiter(this, void 0, void 0, function* () {
            if (detailed) {
                this.ws.send((0, defaults_1.sendresponse)(`turtle.getItemDetail(${slot}, ${detailed})`));
            }
            else {
                this.ws.send((0, defaults_1.sendresponse)(`turtle.getItemDetail(${slot})`));
            }
            return yield this.receive(50);
        });
    }
}
exports.default = Turtle;
