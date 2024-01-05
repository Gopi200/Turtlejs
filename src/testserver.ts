import {default as TurtleServer, mine} from "./index"

const server = new TurtleServer(25565)
setTimeout(async function() {server.connections.Baboon0.ws.send(`
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
automata.digBlock("up")`)},5000)