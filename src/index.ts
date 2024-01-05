import {WebSocketServer} from "ws"
import {default as Turtle} from "./turtle"
export * from "./defaults"
import fs from "fs"
import { JsonDB, Config } from "node-json-db"
import { createConnection } from "mysql"

const sqlconn = createConnection({
  host: "84.105.126.31",
  user: "default",
  password: "TR8qiK%Zf@Spy*iBvg$2",
  database: "turtlejs"
});

sqlconn.connect(function(err:Error) {
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
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err:Error) => {
  if (err) {
    console.log(err)
  }
});} catch {}

export default class TurtleServer{
  turtledb = new JsonDB(new Config("./data/turtles.json", true, false, "/"))
  private wss:typeof WebSocketServer;
  connections:{[label:string]:Turtle} = {}

  private message(data:String, ws:typeof WebSocketServer) {
    let datal = data.toString().split("\n")
      console.log(datal)
      switch (datal[0]) {
        case "No label":
          sqlconn.query(`SELECT COUNT(*) FROM Turtles`, (err:Error, results:any, fields:any) => {
            if (err) {console.error(err); return}
            let label = slurs[results[0]["COUNT(*)"] % slurs.length] + Math.floor(results[0]["COUNT(*)"]/slurs.length)
            ws.send(`[${label}, ${results[0]["COUNT(*)"]+1}]`)
            let data = JSON.parse(datal[1])
            sqlconn.query(`INSERT INTO Turtles(UserID, TurtleName, x, y, z, Facing, Status, Equipment, Inventory, ServerIP) VALUES (${data.OwnerID}, '${label}', ${data.x}, ${data.y}, ${data.z}, '${data.Facing}', 'Waiting', '${JSON.stringify(data.Equipment)}', '${datal[2]}', '${data.ServerIP}')`)
          })
          sqlconn.query(`SELECT * FROM Turtles WHERE TurtleID=1`, function(err:Error, results:any, fields:any) {(async () => {console.log(results)})()})
          break;
        case "label":
          this.connections[datal[1]] = new Turtle(ws, async (timeout?:number) => this.statusawaiter(datal[1], timeout), async () => this.getStatus(datal[1]))
          break
        case "status":
          this.turtledb.push(`/${datal[1]}/status`, [datal[2], "new"])
          break
        case "update":
          this.turtledb.push(`/${datal[1]}/${datal[2]}`, JSON.parse(datal[3])[0])
          break
        case "error":
          this.connections[datal[1]].error = datal[2]
          break
        default:
          this.connections[datal[0]].returned.push(datal[1])
          break;
    }
  }

  private connection(ws:typeof WebSocketServer){
    ws.on('message', (data:string)=>this.message(data,ws))
  }

  async getInventory(label:string){return this.turtledb.getData(`/${label}/inventory`)}
  async getEquipment(label:string){return this.turtledb.getData(`/${label}/equipment`)}
  async getLocation(label:string){let turtledata = await this.turtledb.getData(`/${label}`); return [turtledata.x, turtledata.y, turtledata.z, turtledata.facing]}
  async getStatus(label:string){return this.turtledb.getData(`/${label}/status[0]`)}

  private async statusawaiter(label:string, timeout_iteration?:number):Promise<string>{
    var timed_out = false
    var waitingit = 0
    while(await this.turtledb.getData(`/${label}/status[1]`) == ""){
        if (timeout_iteration) {if(waitingit>timeout_iteration){timed_out = true; break}}
        await new Promise(resolve => setTimeout(resolve, 100))
        waitingit+=1
    }
    if (timed_out){return "Timed out"}
    else{this.turtledb.push(`/${label}/status[1]`, ""); return this.getStatus(label)}
  }

  constructor(port: number){
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', (ws:typeof WebSocketServer)=>this.connection(ws))
  } 
}