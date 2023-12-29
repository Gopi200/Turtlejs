import {default as TurtleServer, mine} from "./index"

const server = new TurtleServer(25565)
setTimeout(async ()=> server.connections.Egghead0.turnLeft(),10000)