import { default as Turtle } from "./turtle";
export * from "./defaults";
import { JsonDB } from "node-json-db";
export default class TurtleServer {
    turtledb: JsonDB;
    private wss;
    connections: {
        [label: string]: Turtle;
    };
    private message;
    private connection;
    constructor(port: number);
}
