import * as http from "node:http";

export class TurtleAPI {
  constructor(TurtleDB, port) {
    this.TurtleDB = TurtleDB;
    this.httpAPI = http
      .createServer((req, res) => this.handleHttpReq(req, res))
      .listen(port);
  }

  async turtleRequest(req, res) {
    switch (req.url) {
      case "/ID":
        try {
          res.end(
            await this.TurtleDB.registerTurtle(
              Number(req.headers.driveid)
            ).join("\n")
          );
        } catch (err) {
          res.end(`Error: ${err}`);
        }
        break;
      case "/setup":
        try {
          res.end(
            await this.TurtleDB.registerDrive(
              Number(req.headers.ownerid),
              req.headers.server
            ).join("\n")
          );
        } catch (err) {
          res.end(`Error: ${err}`);
        }
        break;

      default:
        break;
    }
  }

  async handleHttpReq(req, res) {
    req.body = await ((req) => {
      return new Promise((resolve) => {
        let body = "";
        req
          .on("data", (chunk) => (body += chunk))
          .on("end", () => {
            resolve(body);
          });
      });
    })(req);

    if (req.headers["user-agent"].slice(0, 13) == "computercraft") {
      this.turtleRequest(req, res);
    }

    console.log(`Requested at: ${req.url}`);
    console.log(req.headers);
  }
}
