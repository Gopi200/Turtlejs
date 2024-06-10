import * as http from "node:http";
import httpProxy from "http-proxy";
import { TurtleServer } from "./Websocket.js";

export class TurtleAPI {
  constructor(TurtleDB, Port, WSPort) {
    this.TurtleDB = TurtleDB;

    this.TurtleServer = new TurtleServer(TurtleDB, WSPort);

    this.httpAPI = http.createServer((req, res) =>
      this.handleHttpReq(req, res)
    );

    var proxy = httpProxy.createProxyServer();

    this.httpAPI.on("upgrade", (req, socket, head) => {
      if (req.headers.upgrade == "websocket") {
        proxy.ws(req, socket, head, {
          target: `ws://localhost:${WSPort}`,
          ws: true,
        });
      }
    });

    this.httpAPI.listen(Port);
  }

  async turtleRequest(req, res) {
    switch (req.url) {
      case "/ID":
        try {
          res.end(
            (
              await this.TurtleDB.registerTurtle(Number(req.headers.driveid))
            ).join("\n")
          );
        } catch (err) {
          res.end(`Error: ${err}`);
        }
        break;
      case "/setup":
        try {
          res.end(
            (
              await this.TurtleDB.registerDrive(
                Number(req.headers.ownerid),
                req.headers.server
              )
            ).toString()
          );
        } catch (err) {
          res.end(`Error: ${err}`);
        }
        break;

      default:
        res.end("Turtle connected to wrong path");
        break;
    }
  }

  async userRequest(req, res) {
    req.headers.apikey = decodeURIComponent(req.headers.apikey);
    let UserID;
    try {
      UserID = await this.TurtleDB.getData(`APIKEYS/${req.headers.apikey}`);
    } catch {
      res.end("Wrong APIKEY");
    }
    if (req.method == "GET") {
      if (!this.TurtleServer.checkForTurtle(UserID, req.headers.turtleid)) {
        res.end("Turtle not connected");
      } else {
        res.end(
          await this.TurtleServer.getFromTurtle(
            UserID,
            req.headers.turtleid,
            req.url.slice(1)
          )
        );
      }
    } else if (req.method == "POST") {
      if (!this.TurtleServer.checkForTurtle(UserID, req.headers.turtleid)) {
        res.end("Turtle not connected");
      } else {
        let turtle =
          this.TurtleServer.connections.turtles[UserID][req.headers.turtleid];

        if (req.headers.lazyyield) {
          req.body.replace(
            /(turtle\.\w+)\(([^)(]*(?:\([^)(]*(?:\([^)(]*(?:\([^)(]*\)[^)(]*)*\)[^)(]*)*\)[^)(]*)*)\)/g,
            "addyield($1, $2)"
          );
        }

        turtle.send(req.body);
        res.end();
      }
    }
  }
  async handleHttpReq(req, res) {
    req.body = await (() => {
      return new Promise((resolve) => {
        let body = "";
        req
          .on("data", (chunk) => (body += chunk))
          .on("end", () => {
            resolve(body);
          });
      });
    })();

    try {
      if (req.headers["user-agent"].slice(0, 13) == "computercraft") {
        this.turtleRequest(req, res);
      }
    } catch {
      this.userRequest(req, res);
    }
  }
}
