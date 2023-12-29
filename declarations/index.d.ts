import { turtle } from "./turtle";
export * from "./defaults";
export default class TurtleServer {
    private wss;
    connections: any;
    savedconn: {
        [k: string]: turtle;
    };
    private add_connection;
    private message;
    private connection;
    constructor(port: number);
}
