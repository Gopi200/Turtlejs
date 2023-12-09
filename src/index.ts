import {WebSocketServer} from "ws"
import turtle from "./turtle"
import fs from "fs"
import path from "path"

const slurs = ["Asshole", "Baboon", "Chinky", "Dickhead", "Egghead", "Fuckface", "Geezer", "Hick", "Idiot", "Jerk", "Kid", "Loser", "Meathead", "Nerd", "Old-timer", "Parasite", "Quack", "Retard", "Scumbag", "Turd", "Useless", "Vegetable", "Wanker", "Xanbie", "Yeti", "Zob"]
declare var __dirname;

import * as connectionsjson from "./turtles.json"
var connections: {[k: string]: turtle} = {};
for (const key of Object.keys(connectionsjson)) {
  connections[key] = new turtle()
  Object.setPrototypeOf(connections[key], turtle.prototype)
}
delete connections["default"]

var savedconn: {[a: string]:turtle } = {}

function add_connection(label:string,turt:turtle){
  connections[label] = turt
  for (const key of Object.keys(connections)){
    const { ws, ...turtn } = eval(`connections.${key}`)
    savedconn[key] = turtn
  }
  fs.writeFile(__dirname+"/turtles.json", JSON.stringify(savedconn), (err) => {
    if (err) {
      console.log(err)
    }
  })
  return label
}

export default class TurtleServer{
  private wss:typeof WebSocketServer;

  constructor(port: number){
    this.wss = new WebSocketServer({ port });

    this.wss.on('connection', function connection(ws:typeof WebSocketServer) {
      ws.on('message', function message(data:string) {
        let datal = data.toString().split("\n")
        console.log(datal)
        switch (datal[0]) {
          case "No label":
            ws.send(`func-None\nos.setComputerLabel(\"${add_connection(slurs[Object.keys(connections).length % slurs.length] + Math.floor(Object.keys(connections).length/slurs.length), new turtle(ws))}\")`)
            break;
          case "label":
            connections[datal[1]].ws = ws
            break
          default:
            connections[datal[0]].returned = datal[1]
            break;
        }
      });
    
      ws.on('error', console.error);
    
    });
  }
}

const server = new TurtleServer(25565)

console.log("Server up")