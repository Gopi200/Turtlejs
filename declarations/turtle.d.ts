export default class turtle {
    ws: any;
    Huzzah: string;
    returned: any;
    waitingit: number;
    constructor(ws?: WebSocket);
    private receive;
    craft(count: number): Promise<any>;
    moveforward(): Promise<any>;
    turnleft(): Promise<any>;
    turnright(): Promise<any>;
    getfuellevel(): Promise<any>;
    refuel(count: number): Promise<any>;
    inspect(): Promise<any>;
    inspectup(): Promise<any>;
    inspectdown(): Promise<any>;
}
