"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mine = exports.sendresponse = void 0;
function sendresponse(message) {
    return `_G.ws.send(os.getComputerLabel() .. \"\\n\" .. json.encode({${message}}))`;
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
