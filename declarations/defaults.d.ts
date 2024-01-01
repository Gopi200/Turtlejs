import Turtle from "./turtle";
export declare const acceptmessage = "_G.ws.receive()";
export declare const sendresponse: (message: string) => string;
export declare const sendstatus: (message: string) => string;
export declare function mine(turtle: Turtle, distance?: number): Promise<void>;
