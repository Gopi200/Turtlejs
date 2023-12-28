const direction = ["North","East","South","West"] as const
export type Direction = typeof direction[number]

export class turtle{
    ws:WebSocket
    returned = ""
    x=0
    y=0
    z=0
    facing:Direction="North"
    private waitingit = 0
    constructor(ws:WebSocket, location?:[number, number, number, Direction]){
        if(location){
            this.x = location[0]
            this.y = location[1]
            this.z = location[2]
            this.facing = location[3]
        }
        this.ws = ws
    }

    private async receive(timeout_iteration?:number){
        var timed_out = false
        while(this.returned == ""){
            if (timeout_iteration) {if(this.waitingit>timeout_iteration){timed_out = true; break}}
            await new Promise(resolve => setTimeout(resolve, 100))
            this.waitingit+=1
        }
        if (timed_out){
        return "Nothing"
        }
        else{var temp = `[${this.returned.slice(1,-1)}]`; this.returned = ""; return temp}
    }

    /** 
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    async craft(count?:number){
        this.ws.send(`func-Any\nturtle.craft(${count})`)
        return await this.receive(50)
    }
    
    /** 
     * 	Move the turtle forward one block.
    */
    async moveForward(){
        this.ws.send("func-Any\nturtle.forward()")
        switch (await this.receive(50)){
            case "[true]":
                switch (this.facing) {
                    case "North":
                        this.z-=1
                        break;
                    case "East":
                        this.x+=1
                        break;
                    case "South":
                        this.z+=1
                        break;
                    case "West":
                        this.x-=1
                        break;
                }
                return true
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     * 	Move the turtle back one block.
    */
    async moveBackward(){
        this.ws.send("func-Any\nturtle.back()")
        switch (await this.receive(50)){
            case "[true]":
                switch (this.facing) {
                    case "North":
                        this.z+=1
                        break;
                    case "East":
                        this.x-=1
                        break;
                    case "South":
                        this.z-=1
                        break;
                    case "West":
                        this.x+=1
                        break;
                }
                return true
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     * 	Move the turtle up one block.
    */
    async moveUp(){
        this.ws.send("func-Any\nturtle.up()")
        switch (await this.receive(50)){
            case "[true]":
                this.y+=1
                return true
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     * 	Move the turtle down one block.
    */
    async moveDown(){
        this.ws.send("func-Any\nturtle.down()")
        switch (await this.receive(50)){
            case "[true]":
                this.y-=1
                return true
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     * 	Rotate the turtle to the left by 90 degrees.
    */
    async turnLeft(){
        this.ws.send("func-Any\nturtle.turnLeft()")
        switch (await this.receive(50)) {
            case "[true]":
                this.facing = direction[direction.indexOf(this.facing)-1]
                return true;
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     * 	Rotate the turtle to the right by 90 degrees.
    */
    async turnRight(){
        this.ws.send("func-Any\nturtle.turnRight()")
        switch (await this.receive(50)) {
            case "[true]":
                this.facing = direction[direction.indexOf(this.facing)+1]
                return true;
            case "[false]": //doesn't account for error message
                return false
            default:
                throw new Error("No response")
        }
    }

    /** 
     *  Break the block in front of the turtle.
    */
    async digFront(side?:"left" | "right"){
        this.ws.send(`func-Any\nturtle.dig(${side})`)
        return await this.receive(50)
    }

    /** 
     *  Break the block above the turtle.
    */
    async digUp(side?:"left" | "right"){
        this.ws.send(`func-Any\nturtle.digUp(${side})`)
        return await this.receive(50)
    }

    /** 
     *  Break the block below the turtle.
    */
    async digDown(side?:"left" | "right"){
        this.ws.send(`func-Any\nturtle.digDown(${side})`)
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeFront(text?:string){
        this.ws.send(`func-Any\nturtle.place(${text})`)
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeUp(text?:string){
        this.ws.send(`func-Any\nturtle.placeUp(${text})`)
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeDown(text?:string){
        this.ws.send(`func-Any\nturtle.placeDown(${text})`)
        return await this.receive(50)
    }

    /** 
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    async dropFront(count?:number){
        this.ws.send(`func-Any\nturtle.drop(${count})`)
        return await this.receive(50)
    }

    /** 
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    async dropUp(count?:number){
        this.ws.send(`func-Any\nturtle.dropUp(${count})`)
        return await this.receive(50)
    }

    /** 
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    async dropDown(count?:number){
        this.ws.send(`func-Any\nturtle.dropDown(${count})`)
        return await this.receive(50)
    }

    /** 
     * Change the currently selected slot.
    */
    async select(slot:number){
        this.ws.send(`func-Any\nturtle.select(${slot})`)
        return await this.receive(50)
    }

    /** 
     * Get the amount of items in the specified slot (default selected)
    */
    async getItemCount(slot?:number){
        this.ws.send(`func-Any\nturtle.getItemCount(${slot})`)
        return await this.receive(50)
    }

    /** 
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    async getItemSpace(slot?:number){
        this.ws.send(`func-Any\nturtle.getItemCount(${slot})`)
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block in front of the turtle.
    */
    async detectFront(){
        this.ws.send(`func-Any\nturtle.detect()`)
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block above the turtle.
    */
    async detectUp(){
        this.ws.send(`func-Any\nturtle.detectUp()`)
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block below the turtle.
    */
    async detectDown(){
        this.ws.send(`func-Any\nturtle.detectDown()`)
        return await this.receive(50)
    }

    /** 
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    async compareFront(){
        this.ws.send(`func-Any\nturtle.compare()`)
        return await this.receive(50)
    }

    /** 
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    async compareUp(){
        this.ws.send(`func-Any\nturtle.compareUp()`)
        return await this.receive(50)
    }

    /** 
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    async compareDown(){
        this.ws.send(`func-Any\nturtle.compareDown()`)
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    async attackFront(side?:string){
        this.ws.send(`func-Any\nturtle.attack(${side})`)
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    async attackUp(side?:string){
        this.ws.send(`func-Any\nturtle.attackUp(${side})`)
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    async attackDown(side?:string){
        this.ws.send(`func-Any\nturtle.attackDown(${side})`)
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    async suckFront(count?:number){
        this.ws.send(`func-Any\nturtle.suck(${count})`)
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    async suckUp(count?:number){
        this.ws.send(`func-Any\nturtle.suckUp(${count})`)
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    async suckDown(count?:number){
        this.ws.send(`func-Any\nturtle.suckDown(${count})`)
        return await this.receive(50)
    }

    /**
     * Get the amount of fuel this turtle currently holds
     */
    async getFuelLevel(): Promise<number>{
        this.ws.send("func-Any\nturtle.getFuelLevel()")
        return +(await this.receive(50)).slice(1,-1)
    }

    /**
     * Refuel this turtle
     */
    async refuel(count?:number){
        this.ws.send(`func-Any\nturtle.refuel(${count})`)
        return await this.receive(50)
    }

    /** 
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    async compareTo(slot:number){
        this.ws.send(`func-Any\nturtle.compareTo(${slot})`)
        return await this.receive(50)
    }

    /** 
     * 	Move a specified amount of items from the selected slot to another one.
    */
    async transferTo(slot:number, count?:string){
        if (count) {this.ws.send(`func-Any\nturtle.tranferTo(${slot}, ${count})`)}
        else {this.ws.send(`func-Any\nturtle.transferTo(${slot})`)}
        return await this.receive(50)
    }

    /** 
     * 	Get the currently selected slot.
    */
    async getSelectedSlot(){
        this.ws.send(`func-Any\nturtle.getSelectedSlot()`)
        return await this.receive(50)
    }

    /** 
     * 	Get the maximum amount of fuel this turtle can hold.
    */
     async getFuelLimit(){
        this.ws.send(`func-Any\nturtle.getFuelLimit()`)
        return await this.receive(50)
    }

    /** 
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
     async equipLeft(){
        this.ws.send(`func-Any\nturtle.equipLeft()`)
        return await this.receive(50)
    }

    /** 
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    async equipRight(){
        this.ws.send(`func-Any\nturtle.equipRight()`)
        return await this.receive(50)
    }

    /**
     * 	Get information about the block in front of the turtle.
     */
    async inspect(){
        this.ws.send("func-Any\nturtle.inspect()")
        return eval((await this.receive(50)).replace(/=/g,":"))
    }

    /**
     * 	Get information about the block above the turtle.
     */
    async inspectUp(){
        this.ws.send("func-Any\nturtle.inspectUp()")
        return eval((await this.receive(50)).replace(/=/g,":"))
    }

    /**
     * 	Get information about the block in front of the turtle.
     */
    async inspectDown(){
        this.ws.send("func-Any\nturtle.inspectDown()")
        return eval((await this.receive(50)).replace(/=/g,":"))
    }

    /** 
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    async getItemDetail(slot?:number, detailed?:boolean){
        if (detailed) {this.ws.send(`func-Any\nturtle.tranferTo(${slot}, ${detailed})`)}
        else {this.ws.send(`func-Any\nturtle.transferTo(${slot})`)}
        return await this.receive(50)
    }



    /**
     *  Mine a specified amount of blocks forwards
     */
    async mine(distance?:number){
        // TODO make it work with undefined distance
        this.ws.send(`func-Any\nturtle.mine(${distance})`)
        return (await this.receive(100)).slice(1,-1)
    }
}