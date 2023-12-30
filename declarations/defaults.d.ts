import Turtle from "./turtle";
export declare function sendresponse(message: string): string;
export declare const mine: (distance?: number) => string;
export declare const getInventory: (turtle: Turtle) => Promise<(string | number)[][]>;
