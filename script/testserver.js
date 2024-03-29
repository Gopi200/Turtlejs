import {default as TurtleServer} from "./index.js"
import {mine} from "../Userdata/default/mine.js"
import fs from "fs"

fs.writeFileSync("./Balls.js", `console.log("Hoohoo")`, )

const server = new TurtleServer(25565)
//setTimeout(async function() {mine(server.connections[1])},10000)

/* `function testore(blockdata)
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
ws.send("Asshole0\\n"..json.encode(x))
local automata = peripheral.wrap("left")
automata.digBlock("up")` */