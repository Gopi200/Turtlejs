import {default as TurtleServer, mine} from "./index"

const server = new TurtleServer(25565)
setTimeout(async function() {console.log(await mine(server.connections.Asshole0))},40000)