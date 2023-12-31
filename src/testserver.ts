import {default as TurtleServer, getInventory, mine} from "./index"

const server = new TurtleServer(25565)
setTimeout(async function() {console.log(server.connections.Asshole0.turnLeft())},10000)