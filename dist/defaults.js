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
exports.getInventory = exports.mine = exports.sendresponse = void 0;
function sendresponse(message) {
    return `_G.ws.send(os.getComputerLabel() .. \"\\n\" .. ${message})`;
}
exports.sendresponse = sendresponse;
const mine = function mine(distance) {
    return `
function testore(blockdata)
    assert(type(blockdata[2]["tags"]) == "table", "No block", 2)
    if blockdata[2]["tags"]["forge:ores"] then return true
    else error("No ore") end
end

function mine(amount)
    for mineit= 1,amount do
        turtle.turnLeft()
        if pcall(testore,{turtle.inspectUp()}) then turtle.digUp() end
        if pcall(testore,{turtle.inspectDown()}) then turtle.digDown() end
        if pcall(testore,{turtle.inspect()}) then turtle.dig() end
        turtle.turnRight(); turtle.turnRight()
        if pcall(testore,{turtle.inspect()}) then turtle.dig() end
        turtle.turnLeft(); turtle.dig(); turtle.forward()
    end
    return "Finished mining"
end

${sendresponse(`mine(${distance})`)}`;
};
exports.mine = mine;
const getInventory = function getInventory(turtle) {
    return __awaiter(this, void 0, void 0, function* () {
        turtle.ws.send(`
    local inv = {}
    for it=1,16 do
        local item = turtle.getItemDetail(it)
        if item then
            table.insert(inv, turtle.getItemDetail(it))
        else
            table.insert(inv, {name="",count=0})
        end
    end
    ${sendresponse(`json.encode(inv)`)}
    `);
        return JSON.parse(`[${(yield turtle.receive()).replace(/name=/g, `"name":`).replace(/count=/g, `"count":`)}]`).map((val) => Object.keys(val).map((nestval) => val[nestval]));
    });
};
exports.getInventory = getInventory;
