import turtle from "./turtle";
export declare var connections: {
    [k: string]: turtle;
};
export declare var savedconn: {
    [k: string]: turtle;
};
export default class TurtleServer {
    private wss;
    constructor(port: number);
}
