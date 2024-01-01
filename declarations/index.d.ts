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
    getInventory(label: string): Promise<any>;
    getEquipment(label: string): Promise<any>;
    getLocation(label: string): Promise<any[]>;
    getStatus(label: string): Promise<any>;
    private statusawaiter;
    constructor(port: number);
}
