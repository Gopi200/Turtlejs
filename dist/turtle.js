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
    constructor(ws, location) {
        this.returned = "";
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.facing = "North";
        this.waitingit = 0;
        if (location) {
            this.x = location[0];
            this.y = location[1];
            this.z = location[2];
            this.facing = location[3];
        }
        this.ws = ws;
    }
    receive(timeout_iteration) {
        return __awaiter(this, void 0, void 0, function* () {
            var timed_out = false;
            while (this.returned == "") {
                if (timeout_iteration) {
                    if (this.waitingit > timeout_iteration) {
                        timed_out = true;
                        break;
                    }
                }
                yield new Promise(resolve => setTimeout(resolve, 100));
                this.waitingit += 1;
            }
            if (timed_out) {
                return "Nothing";
            }
            else {
                var temp = `[${this.returned.slice(1, -1)}]`;
                this.returned = "";
                return temp;
            }
        });
    }
    /**
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    craft(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.craft(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle forward one block.
    */
    moveForward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.forward()");
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle back one block.
    */
    moveBackward() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.back()");
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle up one block.
    */
    moveUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.up()");
            return yield this.receive(50);
        });
    }
    /**
     * 	Move the turtle down one block.
    */
    moveDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.down()");
            return yield this.receive(50);
        });
    }
    /**
     * 	Rotate the turtle to the left by 90 degrees.
    */
    turnLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.turnLeft()");
            return yield this.receive(50);
        });
    }
    /**
     * 	Rotate the turtle to the right by 90 degrees.
    */
    turnRight() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.turnRight()");
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block in front of the turtle.
    */
    digFront(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.dig(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block above the turtle.
    */
    digUp(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.digUp(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     *  Break the block below the turtle.
    */
    digDown(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.digDown(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeFront(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.place(${text})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeUp(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.placeUp(${text})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeDown(text) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.placeDown(${text})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    dropFront(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.drop(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    dropUp(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.dropUp(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    dropDown(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.dropDown(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * Change the currently selected slot.
    */
    select(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.select(${slot})`);
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of items in the specified slot (default selected)
    */
    getItemCount(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.getItemCount(${slot})`);
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    getItemSpace(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.getItemCount(${slot})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block in front of the turtle.
    */
    detectFront() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.detect()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block above the turtle.
    */
    detectUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.detectUp()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if there is a solid block below the turtle.
    */
    detectDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.detectDown()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    compareFront() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.compare()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    compareUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.compareUp()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    compareDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.compareDown()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    attackFront(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.attack(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    attackUp(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.attackUp(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    attackDown(side) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.attackDown(${side})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    suckFront(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.suck(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    suckUp(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.suckUp(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    suckDown(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.suckDown(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * Get the amount of fuel this turtle currently holds
     */
    getFuelLevel() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.getFuelLevel()");
            return +(yield this.receive(50)).slice(1, -1);
        });
    }
    /**
     * Refuel this turtle
     */
    refuel(count) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.refuel(${count})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    compareTo(slot) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.compareTo(${slot})`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Move a specified amount of items from the selected slot to another one.
    */
    transferTo(slot, count) {
        return __awaiter(this, void 0, void 0, function* () {
            if (count) {
                this.ws.send(`func-Any\nturtle.tranferTo(${slot}, ${count})`);
            }
            else {
                this.ws.send(`func-Any\nturtle.transferTo(${slot})`);
            }
            return yield this.receive(50);
        });
    }
    /**
     * 	Get the currently selected slot.
    */
    getSelectedSlot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.getSelectedSlot()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Get the maximum amount of fuel this turtle can hold.
    */
    getFuelLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.getFuelLimit()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.equipLeft()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipRight() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send(`func-Any\nturtle.equipRight()`);
            return yield this.receive(50);
        });
    }
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspect()");
            return eval((yield this.receive(50)).replace(/=/g, ":"));
        });
    }
    /**
     * 	Get information about the block above the turtle.
     */
    inspectUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspectUp()");
            return eval((yield this.receive(50)).replace(/=/g, ":"));
        });
    }
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectDown() {
        return __awaiter(this, void 0, void 0, function* () {
            this.ws.send("func-Any\nturtle.inspectDown()");
            return eval((yield this.receive(50)).replace(/=/g, ":"));
        });
    }
    /**
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    getItemDetail(slot, detailed) {
        return __awaiter(this, void 0, void 0, function* () {
            if (detailed) {
                this.ws.send(`func-Any\nturtle.tranferTo(${slot}, ${detailed})`);
            }
            else {
                this.ws.send(`func-Any\nturtle.transferTo(${slot})`);
            }
            return yield this.receive(50);
        });
    }
    /**
     *  Mine a specified amount of blocks forwards
     */
    mine(distance) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO make it work with undefined distance
            this.ws.send(`func-Any\nturtle.mine(${distance})`);
            return (yield this.receive(100)).slice(1, -1);
        });
    }
}
exports.default = turtle;
