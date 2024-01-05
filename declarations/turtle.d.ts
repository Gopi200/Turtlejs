export default class Turtle {
    ws: WebSocket;
    returned: string[];
    statusawaiter: Function;
    statusgetter: Function;
    error: string;
    status: string[];
    constructor(ws: WebSocket, statusawaiter: Function, statusgetter: Function);
    receive(timeout_iteration?: number): Promise<any[]>;
    /**
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    craft(count?: number): Promise<any[]>;
    /**
     * 	Move the turtle forward one block.
    */
    moveForward(): Promise<any[]>;
    /**
     * 	Move the turtle back one block.
    */
    moveBackward(): Promise<any[]>;
    /**
     * 	Move the turtle up one block.
    */
    moveUp(): Promise<any[]>;
    /**
     * 	Move the turtle down one block.
    */
    moveDown(): Promise<any[]>;
    /**
     * 	Rotate the turtle to the left by 90 degrees.
    */
    turnLeft(): Promise<any[]>;
    /**
     * 	Rotate the turtle to the right by 90 degrees.
    */
    turnRight(): Promise<any[]>;
    /**
     *  Break the block in front of the turtle.
    */
    digFront(side?: "left" | "right"): Promise<any[]>;
    /**
     *  Break the block above the turtle.
    */
    digUp(side?: "left" | "right"): Promise<any[]>;
    /**
     *  Break the block below the turtle.
    */
    digDown(side?: "left" | "right"): Promise<any[]>;
    /**
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeFront(text?: string): Promise<any[]>;
    /**
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeUp(text?: string): Promise<any[]>;
    /**
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    placeDown(text?: string): Promise<any[]>;
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    dropFront(count?: number): Promise<any[]>;
    /**
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    dropUp(count?: number): Promise<any[]>;
    /**
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    dropDown(count?: number): Promise<any[]>;
    /**
     * Change the currently selected slot.
    */
    select(slot: number): Promise<any[]>;
    /**
     * Get the amount of items in the specified slot (default selected)
    */
    getItemCount(slot?: number): Promise<any[]>;
    /**
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    getItemSpace(slot?: number): Promise<any[]>;
    /**
     * 	Check if there is a solid block in front of the turtle.
    */
    detectFront(): Promise<any[]>;
    /**
     * 	Check if there is a solid block above the turtle.
    */
    detectUp(): Promise<any[]>;
    /**
     * 	Check if there is a solid block below the turtle.
    */
    detectDown(): Promise<any[]>;
    /**
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    compareFront(): Promise<any[]>;
    /**
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    compareUp(): Promise<any[]>;
    /**
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    compareDown(): Promise<any[]>;
    /**
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    attackFront(side?: string): Promise<any[]>;
    /**
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    attackUp(side?: string): Promise<any[]>;
    /**
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    attackDown(side?: string): Promise<any[]>;
    /**
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    suckFront(count?: number): Promise<any[]>;
    /**
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    suckUp(count?: number): Promise<any[]>;
    /**
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    suckDown(count?: number): Promise<any[]>;
    /**
     * Get the amount of fuel this turtle currently holds
     */
    getFuelLevel(): Promise<number>;
    /**
     * Refuel this turtle
     */
    refuel(count?: number): Promise<any[]>;
    /**
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    compareTo(slot: number): Promise<any[]>;
    /**
     * 	Move a specified amount of items from the selected slot to another one.
    */
    transferTo(slot: number, count?: string): Promise<any[]>;
    /**
     * 	Get the currently selected slot.
    */
    getSelectedSlot(): Promise<any[]>;
    /**
     * 	Get the maximum amount of fuel this turtle can hold.
    */
    getFuelLimit(): Promise<any[]>;
    /**
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipLeft(): Promise<void>;
    /**
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    equipRight(): Promise<any[]>;
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectForward(): Promise<any[]>;
    /**
     * 	Get information about the block above the turtle.
     */
    inspectUp(): Promise<any[]>;
    /**
     * 	Get information about the block in front of the turtle.
     */
    inspectDown(): Promise<any[]>;
    /**
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    getItemDetail(slot?: number, detailed?: boolean): Promise<any[]>;
}
