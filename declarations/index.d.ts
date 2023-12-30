import { default as Turtle } from "./turtle";
export * from "./defaults";
export default class TurtleServer {
    private wss;
    connections: any;
    savedconn: {
        [k: string]: Turtle;
    };
    private add_connection;
    private message;
    private connection;
    constructor(port: number);
}
