import {WebSocketServer} from "ws"
import turtle from "./turtle"
import fs from "fs"

const slurs = ["Asshole", "Baboon", "Chinky", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"]

try {fs.mkdirSync("./data")} catch {}
try {fs.writeFileSync("./data/turtles.json", "{}", { flag: 'wx' },  (err:Error) => {
  if (err) {
    console.log(err)
  }
});} catch {}

export default class TurtleServer{
  private wss:typeof WebSocketServer;
  connections;
  savedconn:{[k:string]:turtle}={}

  private add_connection(label:string,turt:turtle){
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
          ws.send(`func-None\nos.setComputerLabel(\"${this.add_connection(slurs[Object.keys(this.connections).length % slurs.length] + Math.floor(Object.keys(this.connections).length/slurs.length), new turtle(ws))}\")`)
          break;
        case "label":
          this.connections[datal[1]].ws = ws
          break
        default:
          this.connections[datal[0]].returned = datal[1]
          break;
    }
  }

  private connection(ws:typeof WebSocketServer){
    ws.on('message', (data:string)=>this.message(data,ws))
  }

  constructor(port: number){
    this.wss = new WebSocketServer({ port });

    try {this.connections = JSON.parse(fs.readFileSync("./data/turtles.json", "utf-8"), (key, value)=>{Object.setPrototypeOf(value, turtle.prototype); return value})}
    catch(err) {console.error(err)}
    
    for (const key of Object.keys(this.connections)){
      const { ws, ...turtn } = this.connections[key]
      this.savedconn[key] = turtn
    }

    this.wss.on('connection', (ws:typeof WebSocketServer)=>this.connection(ws))
  }
}