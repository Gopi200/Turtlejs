import {WebSocketServer} from "ws"
import {default as Turtle} from "./turtle.js"
import fs from "fs"
import { createConnection } from "mysql"
import * as dotenv from "dotenv"
dotenv.config()

const sqlconn = createConnection({
    host: process.env.sql_host,
    port: process.env.sql_port,
    user: process.env.sql_user,
    password: process.env.sql_password,
    database: process.env.sql_database
});

sqlconn.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + sqlconn.threadId);
});

sqlconn.query(`DELETE FROM Turtles`)
sqlconn.query(`ALTER TABLE Turtles AUTO_INCREMENT=1`)

const slurs = ["Asshole", "Baboon", "Clown", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"]

try {fs.mkdirSync("./data")} catch {}
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err) => {
  if (err) {
    console.log(err)
  }
});} catch {}

export default class TurtleServer{
    wss;
    connections = {}

    message(data, ws) {
        let datal = data.toString().split("\n")
        console.log(datal)
            switch (datal[0]) {
                case "New":
                    switch (datal[1]){
                        case "Turtle":
                            sqlconn.query(`SELECT COUNT(*) FROM Turtles`, (err, results, fields) => {
                                if (err) {console.error(err); return}
                                let label = slurs[results[0]["COUNT(*)"] % slurs.length] + Math.floor(results[0]["COUNT(*)"]/slurs.length)
                                ws.send(`["${label}", ${results[0]["COUNT(*)"]+1}]`)
                                let data = JSON.parse(datal[1])
                                sqlconn.query(`INSERT INTO Turtles(UserID, TurtleName, x, y, z, Facing, Status, Equipment, Inventory, ServerIP)
                                VALUES (${data.OwnerID}, '${label}', ${data.x}, ${data.y}, ${data.z}, '${data.Facing}', 'Waiting', '${JSON.stringify(data.Equipment)}', '${datal[2]}', '${data.ServerIP}')`);
                            })
                            sqlconn.query(`SELECT * FROM Turtles WHERE TurtleID=1`, function(err, results, fields) {(async () => {console.log(results)})()})
                            break
                        case "User":
                            fs.mkdirSync("./Userscripts/"+datal[2])
                            break
                        default:
                            ws.send("New what?")
                            break
                    }
                    break;
                case "Turtleconn":
                    this.connections[+datal[1]] = new Turtle(ws)
                    break
                case "status":
                    this.connections[+datal[1]].status = [datal[2], "New"]
                    break
                case "update":
                    let data = JSON.parse(datal[3])
                    if (typeof data == "object") {data=JSON.stringify(data)}
                    sqlconn.query(`UPDATE Turtles
                    SET ${datal[2]} = '${data}'
                    WHERE TurtleID = ${+datal[1]}`)
                    break
                case "error":
                    this.connections[+datal[1]].error = datal[2]
                    break
                default:
                    this.connections[+datal[0]].returned.push(datal[1])
                    break;
        }
    }

    connection(ws){
        ws.on('message', (data)=>this.message(data,ws))
    }

    constructor(port){
        this.wss = new WebSocketServer({ port });

        this.wss.on('connection', (ws)=>this.connection(ws))
    } 
}