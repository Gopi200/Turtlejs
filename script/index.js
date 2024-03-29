import {WebSocketServer} from "ws"
import {default as Turtle} from "./turtle.js"
import fs from "fs"
import { createConnection } from "mysql"
import * as dotenv from "dotenv"
import {compare, hash} from "bcrypt"
import {randomBytes as rb} from "crypto"
import defaultnames from "../Userdata/default/names.js"
import EventEmitter from "events"
dotenv.config()

const sqlconn = createConnection({
    host: process.env.sql_host,
    port: process.env.sql_port,
    user: process.env.sql_user,
    password: process.env.sql_password,
    database: process.env.sql_database,
    multipleStatements: true
});

sqlconn.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + sqlconn.threadId);
});

async function newkey() {
    APIKey = hash(rb(32).toString("base64"), 10)
    sqlconn.query(`SELECT * FROM useraccounts WHERE APIKey=${APIKey}`, (err, results) => {if (results[0].length>0){return newkey()} else {sqlconn.query(`INSERT INTO useraccounts(APIKey) VALUES(${APIKey})`)}})
    return APIKey
}

var events = {}

try {fs.mkdirSync("./data")} catch {}
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err) => {
  if (err) {
    console.log(err)
  }
});} catch {}

export default class TurtleServer{
    wss;
    connections = {}

    connectas(ws, type, id, APIKey) {
        if (type=="turtle"){
            events[id] = new EventEmitter()
            this.connections[id] = new Turtle(ws)
        }
    }

    async registerturtle(ws, data, inventory) {
        console.log("Registering")
        sqlconn.query(`SELECT COUNT(*) FROM Turtles WHERE UserID=${data.OwnerID}; SELECT Names FROM useraccounts WHERE UserID=${data.OwnerID};`, (err, results) => {
            if (err) {console.error(err); return}
            console.log(results)
            let names;
            if (results[1][0]["Names"]==null) names = defaultnames
            else names = JSON.parse(results[1][0]["Names"])
            let id = results[0][0]["COUNT(*)"]+1
            this.connectas(ws, "turtle", id)
            let label = names[(id-1) % names.length] + " " + Math.floor((id-1)/names.length)
            ws.send(`["${label}", ${id}]`)
            sqlconn.query(`INSERT INTO Turtles(UserID, TurtleName, x, y, z, Facing, Status, Equipment, Inventory, ServerIP)
            VALUES (${data.OwnerID}, '${label}', ${data.x}, ${data.y}, ${data.z}, '${data.Facing}', 'Waiting', '${JSON.stringify(data.Equipment)}', '${inventory}', '${data.ServerIP}')`, (err, results) => {if (err) console.error(err); ws.send(`["${label}", ${results.insertId}]`)});
            return id
        })
    }

    async message(data, ws) {
        let datal = data.toString().split("\n")
        console.log(datal)
            switch (datal[0]) {
                case "New":
                    switch (datal[1]){
                        case "Turtle":
                            let data = JSON.parse(datal[2])
                            this.registerturtle(ws, data, datal[3]).then(
                                sqlconn.query(`SELECT * FROM Turtles WHERE TurtleID=1`, function(err, results) {(async () => {console.log(results)})()})
                            )
                            break
                        case "user":
                            fs.mkdirSync("./Userscripts/"+datal[2])
                            newkey()
                            break
                        default:
                            ws.send("New what?")
                            break
                    }
                    break;
                case "conn":
                    this.connectas(ws, datal[1], datal[2], datal[3])
                    break
                case "status":
                    this.connections[+datal[1]].status = [datal[2], "New"]
                    break
                case "update":
                    let data = JSON.parse(datal[3])
                    events[+datal[1]].emit(datal[2], data)
                    if (typeof data == "object") {data=JSON.stringify(data)}
                    sqlconn.query(`UPDATE Turtles
                    SET ${datal[2]} = '${data}'
                    WHERE TurtleID = ${+datal[1]}`)
                    break
                case "error":
                    this.connections[+datal[1]].error = datal[2]
                    break
                case "get":
                    userid = +datal[1]
                    userkey = datal[2]
                    break
                case "post":
                    break
                default:
                    this.connections[+datal[0]].returned.push(datal[1])
                    break;
        }
    }

    connection(ws, req){
        console.log(req.headers)
        ws.on('message', (data)=>this.message(data,ws))
    }

    constructor(port){
        this.wss = new WebSocketServer({ port });

        this.wss.on('connection', (ws, req)=>this.connection(ws, req))
    } 
}