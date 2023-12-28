type direction = "North" | "East" | "South" | "West";
export default class turtle {
    ws: WebSocket;
    returned: string;
    x: number;
    y: number;
    z: number;
    facing: direction;
    private waitingit;
    constructor(ws: WebSocket, location?: [number, number, number, direction]);
    private receive;
    /**
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    craft(count?: number): Promise<string>;
    /**
     * 	Move the turtle forward one block.
    */
    moveForward(): Promise<string>;
    /**
     * 	Move the turtle back one block.
    */
    moveBackward(): Promise<string>;
    /**
     * 	Move the turtle up one block.
    */
    moveUp(): Promise<string>;
    /**
     * 	Move the turtle down one block.
    */
    moveDown(): Promise<string>;
    /**
     * 	Rotate the turtle to the left by 90 degrees.
    */
    turnLeft(): Promise<string>;
    /**
     * 	Rotate the turtle to the right by 90 degrees.
    */
    turnRight(): Promise<string>;
    /**
     *  Break the block in front of the turtle.
    */
    digFront(side?: "left" | "right"): Promise<string>;
    /**
     *  Break the block above the turtle.
    */
    digUp(side?: "left" | "right"): Promise<string>;
    /**
     *  Break the block below the turtle.
    */
    digDown(side?: "left" | "right"): Promise<string>;
    /**
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeFront(text?: string): Promise<string>;
    /**
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeUp(text?: string): Promise<string>;
    /**
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeDown(text?: string): Promise<string>;
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    dropFront(count?: number): Promise<string>;
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    dropUp(count?: number): Promise<string>;
    /**
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    dropDown(count?: number): Promise<string>;
    /**
     * Change the currently selected slot.
    */
    select(slot: number): Promise<string>;
    /**
     * Get the amount of items in the specified slot (default selected)
    */
    getItemCount(slot?: number): Promise<string>;
    /**
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    getItemSpace(slot?: number): Promise<string>;
    /**
     * 	Check if there is a solid block in front of the turtle.
    */
    detectFront(): Promise<string>;
    /**
     * 	Check if there is a solid block above the turtle.
    */
    detectUp(): Promise<string>;
    /**
     * 	Check if there is a solid block below the turtle.
    */
    detectDown(): Promise<string>;
    /**
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    compareFront(): Promise<string>;
    /**
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    compareUp(): Promise<string>;
    /**
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    compareDown(): Promise<string>;
    /**
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    attackFront(side?: string): Promise<string>;
    /**
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    attackUp(side?: string): Promise<string>;
    /**
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    attackDown(side?: string): Promise<string>;
    /**
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    suckFront(count?: number): Promise<string>;
    /**
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    suckUp(count?: number): Promise<string>;
    /**
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    suckDown(count?: number): Promise<string>;
    /**
     * Get the amount of fuel this turtle currently holds
     */
    getFuelLevel(): Promise<number>;
    /**
     * Refuel this turtle
     */
    refuel(count?: number): Promise<string>;
    /**
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    compareTo(slot: number): Promise<string>;
    /**
     * 	Move a specified amount of items from the selected slot to another one.
    */
    transferTo(slot: number, count?: string): Promise<string>;
    /**
     * 	Get the currently selected slot.
    */
    getSelectedSlot(): Promise<string>;
    /**
     * 	Get the maximum amount of fuel this turtle can hold.
    */
    getFuelLimit(): Promise<string>;
    /**
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipLeft(): Promise<string>;
    /**
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipRight(): Promise<string>;
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspect(): Promise<any>;
    /**
     * 	Get information about the block above the turtle.
     */
    inspectUp(): Promise<any>;
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectDown(): Promise<any>;
    /**
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    getItemDetail(slot?: number, detailed?: boolean): Promise<string>;
    /**
     *  Mine a specified amount of blocks forwards
     */
    mine(distance?: number): Promise<string>;
}
export {};
