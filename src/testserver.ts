import {default as TurtleServer, mine} from "./index"

const server = new TurtleServer(25565)
setTimeout(async function() {console.log(await server.connections.Asshole0.ws.send(mine(3)))},10000)