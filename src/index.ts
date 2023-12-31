import {WebSocketServer} from "ws"
import {Direction, default as Turtle} from "./turtle"
import { getInventory } from "./defaults"
export * from "./defaults"
import fs from "fs"
import { JsonDB, Config } from "node-json-db"
import { updateLanguageServiceSourceFile } from "typescript"

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

export default class TurtleServer{
  turtledb = new JsonDB(new Config("./data/turtles.json", true, false, "."))
  private wss:typeof WebSocketServer;
  connections:{[label:string]:Turtle} = {}

  private message(data:String, ws:typeof WebSocketServer) {
    let datal = data.toString().split("\n")
      console.log(datal)
      switch (datal[0]) {
        case "No label":
          this.connections[datal[1]] = new Turtle(ws, omit(JSON.parse(datal[1]), "URL") as {})
          this.turtledb.push("."+slurs[Object.keys(this.connections).length % slurs.length] + Math.floor(Object.keys(this.connections).length/slurs.length), this.connections[datal[1]])
          break;
        case "label":
          this.connections[datal[1]].ws = ws
          break
        case "status":
          this.connections[datal[1]].status = datal[2]
          break
        case "update":
          break
        default:
          this.connections[datal[0]].returned.push(datal[1])
          break;
    }
  }

  private connection(ws:typeof WebSocketServer){
    ws.on('message', (data:string)=>this.message(data,ws))
  }

  constructor(port: number){
    this.wss = new WebSocketServer({ port });

    (async ()=>this.connections = await this.turtledb.getData("."))()

    this.wss.on('connection', (ws:typeof WebSocketServer)=>this.connection(ws))
  } 
}