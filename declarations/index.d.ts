import turtle from "./turtle";
export declare var savedconn: {
    [a: string]: turtle;
};
export default class TurtleServer {
    private wss;
    constructor(port: number);
}
