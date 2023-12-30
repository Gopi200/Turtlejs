import {WebSocketServer} from "ws"
import {Direction, default as Turtle} from "./turtle"
import { getInventory } from "./defaults"
export * from "./defaults"
import fs from "fs"

const slurs = ["Asshole", "Baboon", "Clown", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"]

try {fs.mkdirSync("./data")} catch {}
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err:Error) => {
  if (err) {
    console.log(err)
  }
});} catch {}

export default class TurtleServer{
  private wss:typeof WebSocketServer;
  connections;
  savedconn:{[k:string]:Turtle}={}

  private add_connection(label:string,turt:Turtle){
    this.connections[label] = turt
    const { ws, ...turtn } = this.connections[label]
    this.savedconn[label] = turtn
    fs.writeFile("./data/turtles.json", JSON.stringify(this.savedconn), (err:Error) => {
      if (err) {
        console.log(err)
      }
    })
    return label
  }

  private message(data:String, ws:typeof WebSocketServer) {
    let datal = data.toString().split("\n")
      console.log(datal)
      switch (datal[0]) {
        case "No label":
          ws.send(this.add_connection(slurs[Object.keys(this.connections).length % slurs.length] + Math.floor(Object.keys(this.connections).length/slurs.length), new Turtle(ws, (datal[1].split(" ").map(function(val, i){if (i<3){return +val} else{return val as Direction}}) as [number,number,number,Direction]))))
          break;
        case "label":
          this.connections[datal[1]].ws = ws
          getInventory(this.connections[datal[1]])
          break
        case "status":
          this.connections[datal[1]].status = datal[2]
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

    try {this.connections = JSON.parse(fs.readFileSync("./data/turtles.json", "utf-8"), (key, value)=>{if (key != "returned") {Object.setPrototypeOf(value, Turtle.prototype)}; return value})}
    catch(err) {console.error(err)}
    
    for (const key of Object.keys(this.connections)){
      const { ws, ...turtn } = this.connections[key]
      this.savedconn[key] = turtn
    }

    this.wss.on('connection', (ws:typeof WebSocketServer)=>this.connection(ws))
  } 
}