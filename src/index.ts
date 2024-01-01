import {WebSocketServer} from "ws"
import {default as Turtle} from "./turtle"
export * from "./defaults"
import fs from "fs"
import { JsonDB, Config } from "node-json-db"

const slurs = ["Asshole", "Baboon", "Clown", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"]

try {fs.mkdirSync("./data")} catch {}
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err:Error) => {
  if (err) {
    console.log(err)
  }
});} catch {}

function omit<T extends object, K extends keyof T>(obj: T, key: K): Omit<T, K> {
  const o: Omit<T, K> & Partial<Pick<T, K>> = { ...obj };
  delete o[key];
  return o;
}

type Inventory = {[key:string]:string|number}[]

export default class TurtleServer{
  turtledb = new JsonDB(new Config("./data/turtles.json", true, false, "/"))
  private wss:typeof WebSocketServer;
  connections:{[label:string]:Turtle} = {}

  private message(data:String, ws:typeof WebSocketServer) {
    let datal = data.toString().split("\n")
      console.log(datal)
      switch (datal[0]) {
        case "No label":
          (async function(server) {
            let l = Object.keys(await server.turtledb.getData("/")).length
            let label = slurs[l % slurs.length] + Math.floor(l/slurs.length)
            server.connections[label] = new Turtle(ws, async (timeout?:number) => server.statusawaiter(label, timeout), async () => server.getStatus(label))
            server.connections[label].ws.send(label)
            let data:{[datatype:string]:number|string|(string|number|undefined)[][]|string[]} = omit(JSON.parse(datal[1]), "URL");
            data.inventory = (JSON.parse(datal[2]) as Inventory).map((val)=>{
              let itemarr = Object.keys(val).map((nestval)=>{if (nestval!="nbt"){return val[nestval]}});
              if (itemarr[0] == null) {itemarr.shift()}
              if (typeof itemarr[0] == "number"){itemarr.reverse()}
              return itemarr})
            data.status = ["Waiting", ""]
            server.turtledb.push("/"+ label, data)
          })(this)
          break;
        case "label":
          this.connections[datal[1]] = new Turtle(ws, async (timeout?:number) => this.statusawaiter(datal[1], timeout), async () => this.getStatus(datal[1]))
          break
        case "status":
          this.turtledb.push(`/${datal[1]}/status`, [datal[2], "new"])
          break
        case "update":
          if (datal[2] == "inventory"){
            this.turtledb.push(`/${datal[1]}/${datal[2]}`, (JSON.parse(datal[3]) as Inventory).map((val)=>{
              let itemarr = Object.keys(val).map((nestval)=>{if (nestval!="nbt"){return val[nestval]}});
              if (itemarr[0] == null) {itemarr.shift()}
              if (typeof itemarr[0] == "number"){itemarr.reverse()}
              return itemarr}))
          }
          else{
            this.turtledb.push(`/${datal[1]}/${datal[2]}`, JSON.parse(datal[3])[0])
          }
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