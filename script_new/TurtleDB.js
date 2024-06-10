import fs from "fs";
import { randomBytes } from "crypto";

const defaultnames = [
  "P. Alabamensis",
  "E. Blandingii",
  "A. Cartilaginea",
  "N. Depressus",
  "C. Enigmatica",
  "G. Flavimaculata",
  "G. Geographica",
  "T. Horsfieldii",
  "K. Integrum",
  "G. Japonica",
  "T. Kleinmanni",
  "M. Latisternum",
  "C. Mydas",
  "T. Nebulosa",
  "C. Oldhamii",
  "G. Pseudogeographica",
  "S. Quadriocellata",
  "D. Reticularia",
  "P. Smithii",
  "E. Tanybaraga",
  "P. Upembae",
  "E. Victoriae",
  "P. Williamsi",
  "C. Xenochelys",
  "T. Yaquia",
  "M. Zuliae",
];

class Lock {
  constructor() {}

  queue = [];
  async acquire() {
    new Promise((resolve) => {
      if (this.queue.length == 0) {
        resolve();
      }
      this.queue.push(resolve);
    });
  }

  async release() {
    this.queue.shift();
    if (this.queue.length != 0) {
      this.queue[0]();
    }
  }
}

function newKey(UserID) {
  UserID = UserID.toString();
  while (UserID.length < 8) {
    UserID = "0" + UserID;
  }
  let fin = "";
  for (let i = 1; i <= UserID.length; i++) {
    fin +=
      randomBytes(
        Math.round(
          (64 / UserID.length) * i - Math.floor((64 / UserID.length) * i)
        ) +
          Math.floor(64 / UserID.length) -
          1
      ).toString("ascii") + UserID.slice(i - 1, i);
  }
  return Buffer.from(fin, "ascii");
}

export class TurtleDB {
  constructor(Filepath) {
    this.Filepath = Filepath;
    if (fs.existsSync(Filepath)) {
      this.jsonDB = JSON.parse(fs.readFileSync(Filepath));
    } else {
      let adminkey = newKey(0).toString("ascii");
      this.jsonDB = {
        users: {
          0: { name: "admin", APIKEY: adminkey, nameset: defaultnames },
        },
        drives: {},
        APIKEYS: { [adminkey]: 0 },
      };
      fs.writeFileSync(Filepath, JSON.stringify(this.jsonDB));
    }
  }

  async getData(dataPath) {
    var splitpath = dataPath.split("/");
    if (splitpath[0] == "") splitpath.shift();
    var cur = this.jsonDB;
    for (const it in splitpath) {
      cur = cur[splitpath[it]];
    }
    return cur;
  }

  async count(dataPath) {
    return Object.keys(await this.getData(dataPath)).length;
  }

  push(dataPath, data) {
    return new Promise((resolve) => {
      var splitpath = dataPath.split("/");
      if (splitpath[0] == "") splitpath.shift();
      var cur = this.jsonDB;
      var it = 0;
      for (it in splitpath) {
        if (cur[splitpath[it]] == undefined) {
          cur[splitpath[it]] = {};
        }
        if (it < splitpath.length - 1) {
          cur = cur[splitpath[it]];
        }
      }
      cur[splitpath[it]] = data;
      fs.writeFile(this.Filepath, JSON.stringify(this.jsonDB), resolve);
    });
  }

  lock = new Lock();

  async registerTurtle(DriveID) {
    await this.lock.acquire();
    const user = await this.getData(`/drives/${DriveID}/user`);
    const ID = (await this.count(`/users/${user}`)) - 3;
    const nameset = await this.getData(`/users/${user}/nameset`);
    const NAME = nameset[ID % nameset.length] + Math.floor(ID / 26);
    this.push(`/users/${user}/${ID}`, { name: NAME });
    this.lock.release();
    return [ID, NAME];
  }

  async registerDrive(owner, server) {
    //Get server, owner, push to db
    await this.lock.acquire();
    const ID = await this.count(`/drives`);
    this.push(`/drives/${ID}`, { user: owner, server: server });

    this.lock.release();
    return ID;
  }

  async registerUser(name) {
    //Make API key, push to db
    await this.lock.acquire();
    const ID = await this.count(`/users`);
    const APIKEY = newKey(ID).toString("ascii");

    this.push(`/users/${ID}`, {
      name: name,
      APIKEY: APIKEY,
      nameset: defaultnames,
    });

    this.push(`/APIKEYS/${APIKEY}`, ID);

    this.lock.release();
  }
}
