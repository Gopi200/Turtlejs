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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./index"));
const server = new index_1.default(25565);
setTimeout(function () {
    return __awaiter(this, void 0, void 0, function* () {
        server.connections.Baboon0.ws.send(`
function testore(blockdata)
    for _, value in pairs(blockdata.tags) do
        if value == "minecraft:block/forge:ores" then return true end
    end
    error("No ore")
end

local geoscanner = peripheral.wrap("right") 
local x = geoscanner.scan(16)
for i=#x, 1, -1 do
    if not pcall(testore, x[i]) then table.remove(x, i) 
    else x[i].tags = nil end
end
ws.send("Baboon0\\n"..json.encode(x))
local automata = peripheral.wrap("left")
automata.digBlock("up")`);
    });
}, 5000);
