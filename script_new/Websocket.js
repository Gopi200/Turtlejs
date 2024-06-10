import { WebSocketServer } from "ws";

export class TurtleServer {
  wss;
  connections = { turtles: {} };

  getFromTurtle(UserID, TurtleID, request) {
    return new Promise((resolve) => {
      let ws = this.connections.turtles[UserID][TurtleID];
      ws.send(`{"get":["${request}"]}`);
      ws.once("message", (data) => resolve(data));
    });
  }

  checkForTurtle(UserID, TurtleID) {
    try {
      if (this.connections.turtles[UserID].hasOwnProperty(TurtleID)) {
        return true;
      }
    } catch {
      return false;
    }
  }

  async message(data, ws) {
    console.log(data.toString());
  }

  async connection(ws, req) {
    if (req.headers["user-agent"].slice(0, 13) == "computercraft") {
      ws.once("message", async (data) => {
        data = JSON.parse(data);
        let user = await this.turtledb.getData(`/drives/${data.driveid}/user`);
        try {
          this.connections.turtles[user][data.id] = ws;
        } catch {
          this.connections.turtles[user] = { [data.id]: ws };
        }
      });
    } else {
      console.log(req.headers);
      //register a user connection
    }
    ws.on("message", (data) => this.message(data, ws));
  }

  constructor(turtledb, port) {
    this.turtledb = turtledb;
    this.wss = new WebSocketServer({ port });

    this.wss.on("connection", (ws, req) => this.connection(ws, req));
  }
}
