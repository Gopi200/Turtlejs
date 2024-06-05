import { WebSocketServer } from "ws";
import { TurtleDB } from "./TurtleDB.js";
import { TurtleAPI } from "./TurtleAPI.js";

//Start a jsonDB with all turtleIDs and such
const turtledb = new TurtleDB("./script_new/TurtleDB.json");

//turtledb.registerUser("Gopi");
//turtledb.registerDrive(0, "local");

/*Data structured as:
{ID: {
    name: ""
}}
*/

//Start a http API
const turtleAPI = new TurtleAPI(turtledb, 25565);

console.log(`httpAPI listening on 127.0.0.1:25565`);

//Start a websocket
