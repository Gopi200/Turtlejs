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
    getX(label: string): Promise<any>;
    getY(label: string): Promise<any>;
    getZ(label: string): Promise<any>;
    getFacing(label: string): Promise<any>;
    constructor(port: number);
}
