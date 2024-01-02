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
exports.mine = exports.sendstatus = exports.sendresponse = exports.acceptmessage = void 0;
exports.acceptmessage = `_G.ws.receive()`;
const sendresponse = (message) => `_G.ws.send(os.getComputerLabel() .. "\\n" .. json.encode({${message}}))`;
exports.sendresponse = sendresponse;
const sendstatus = (message) => `_G.ws.send("status\\n" .. os.getComputerLabel() .. "\\n" .. "${message}")`;
exports.sendstatus = sendstatus;
function mine(turtle, distance) {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield turtle.statusgetter()) == "Waiting") {
            turtle.ws.send(`
        function testore(blockdata)
            if blockdata[2]["tags"]["forge:ores"] then return true
            else error("No ore") end
        end

        function mine(previous, start)
            if previous ~= "down" then if pcall(testore, {turtle.inspectUp()}) then 
                    turtle.digUp()
                    turtle.up()
                    mine("up")
            end end
            if previous ~= "up" then if pcall(testore, {turtle.inspectDown()}) then 
                    turtle.digDown()
                    turtle.down()
                    mine("down")
            end end
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()
            if previous == "down" or previous == "up" then if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end end
            turtle.turnLeft()
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()

            if start then
            elseif previous == "up" then turtle.down()
            elseif previous == "down" then turtle.up()
            else turtle.back()
            end
        end

        function startmining(distance)
            ${(0, exports.sendstatus)("Mining")}
            if distance then
                for i=1,distance do
                    turtle.dig()
                    turtle.forward()
                    mine(nil, true)
                end
            else
                local dir = {North={"z", -1}, East={"x", 1}, South={"z", 1}, West={"x", -1}}
                local it = _G.data.saveddata[dir[_G.data.saveddata.facing][1]] % 16
                if dir[_G.data.saveddata.facing][2] == -1 then it = it*-1+15 end
                local connected = true
                while true do
                    if it == 15 then
                        if connected then
                            connected = pcall(_G.ws.send, "status\\n" .. os.getComputerLabel() .. "\\n" .. "Mining")
                            local _, msg = pcall(_G.ws.receive)
                            if msg == "stop" then break end
                        else
                            _G.ws = http.websocket(_G.data.saveddata.URL)
                            if _G.ws then 
                                connected = true 
                                _G.ws.send("label\\n" .. os.getComputerLabel())
                            end
                        end
                        it = -1
                    end
                    local moved = false
                    while not moved do
                        turtle.dig()
                        moved = turtle.forward()
                    end
                    it = it + 1
                    mine(nil, true)
                end
            end
        end

        startmining(${distance})`);
            while (true) {
                if ((yield turtle.statusawaiter()) != "Mining") {
                    break;
                }
                else {
                    turtle.ws.send("Continue");
                }
            }
        }
        else {
            yield turtle.statusawaiter();
            turtle.ws.send("stop");
        }
        yield turtle.statusawaiter();
    });
}
exports.mine = mine;
