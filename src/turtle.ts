import { sendresponse} from "./defaults"
import {JsonDB} from "node-json-db"

export default class Turtle{
    ws:WebSocket
    returned:string[] = []
    statusawaiter:Function
    statusgetter:Function
    error = ""
    constructor(ws:WebSocket, statusawaiter:Function, statusgetter:Function){
        this.ws = ws
        this.statusawaiter = statusawaiter
        this.statusgetter = statusgetter
    }

    async receive(timeout_iteration?:number):Promise<any[]>{
        var timed_out = false
        var waitingit = 0
        while(this.returned.length == 0){
            if (timeout_iteration) {if(waitingit>timeout_iteration){timed_out = true; break}}
            await new Promise(resolve => setTimeout(resolve, 100))
            waitingit+=1
        }
        if (timed_out){return ["Timed out"]}
        else{var temp = JSON.parse(this.returned[0]); this.returned.shift(); return temp}
    }

    /** 
     * 	Craft a recipe based on the turtle's inventory. The turtle cannot contain any items other than the ones involved in the recipe.
    */
    async craft(count?:number){
        this.ws.send(sendresponse(`turtle.craft(${count})`))
        return await this.receive(50)
    }
    
    /** 
     * 	Move the turtle forward one block.
    */
    async moveForward(){
        this.ws.send(sendresponse("turtle.forward()"))
        return await this.receive(50)
    }

    /** 
     * 	Move the turtle back one block.
    */
    async moveBackward(){
        this.ws.send(sendresponse("turtle.back()"))
        return await this.receive(50)
    }

    /** 
     * 	Move the turtle up one block.
    */
    async moveUp(){
        this.ws.send(sendresponse("turtle.up()"))
        return await this.receive(50)
    }

    /** 
     * 	Move the turtle down one block.
    */
    async moveDown(){
        this.ws.send(sendresponse("turtle.down()"))
        return await this.receive(50)
    }

    /** 
     * 	Rotate the turtle to the left by 90 degrees.
    */
    async turnLeft(){
        this.ws.send(sendresponse("turtle.turnLeft()"))
        return await this.receive(50)
    }

    /** 
     * 	Rotate the turtle to the right by 90 degrees.
    */
    async turnRight(){
        this.ws.send(sendresponse("turtle.turnRight()"))
        return await this.receive(50)
    }

    /** 
     *  Break the block in front of the turtle.
    */
    async digFront(side?:"left" | "right"){
        this.ws.send(sendresponse(`turtle.dig(${side})`))
        return await this.receive(50)
    }

    /** 
     *  Break the block above the turtle.
    */
    async digUp(side?:"left" | "right"){
        this.ws.send(sendresponse(`turtle.digUp(${side})`))
        return await this.receive(50)
    }

    /** 
     *  Break the block below the turtle.
    */
    async digDown(side?:"left" | "right"){
        this.ws.send(sendresponse(`turtle.digDown(${side})`))
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world in front of the turtle. Placing an item that is not a block interacts with the block in front of the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeFront(text?:string){
        this.ws.send(sendresponse(`turtle.place(${text})`))
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world above the turtle. Placing an item that is not a block interacts with the block above the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeUp(text?:string){
        this.ws.send(sendresponse(`turtle.placeUp(${text})`))
        return await this.receive(50)
    }

    /** 
     * 	Place a block or item into the world below the turtle. Placing an item that is not a block interacts with the block below the turtle.
     *  @param text The text that will be put on a sign if that is what was placed.
    */
    async placeDown(text?:string){
        this.ws.send(sendresponse(`turtle.placeDown(${text})`))
        return await this.receive(50)
    }

    /** 
     * 	Drop an amount of items off the currently selected stack into the inventory in front of the turtle, or as an item into the world if there is no inventory.
    */
    async dropFront(count?:number){
        this.ws.send(sendresponse(`turtle.drop(${count})`))
        return await this.receive(50)
    }

    /** 
     * 	Drop an amount of items off the currently selected stack into the inventory above the turtle, or as an item into the world if there is no inventory.
    */
    async dropUp(count?:number){
        this.ws.send(sendresponse(`turtle.dropUp(${count})`))
        return await this.receive(50)
    }

    /** 
     * Drop an amount of items off the currently selected stack into the inventory below the turtle, or as an item into the world if there is no inventory.
    */
    async dropDown(count?:number){
        this.ws.send(sendresponse(`turtle.dropDown(${count})`))
        return await this.receive(50)
    }

    /** 
     * Change the currently selected slot.
    */
    async select(slot:number){
        this.ws.send(sendresponse(`turtle.select(${slot})`))
        return await this.receive(50)
    }

    /** 
     * Get the amount of items in the specified slot (default selected)
    */
    async getItemCount(slot?:number){
        this.ws.send(sendresponse(`turtle.getItemCount(${slot})`))
        return await this.receive(50)
    }

    /** 
     * Get the amount of items that can still be put in the stack in the specified slot (default selected)
    */
    async getItemSpace(slot?:number){
        this.ws.send(sendresponse(`turtle.getItemSpace(${slot})`))
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block in front of the turtle.
    */
    async detectFront(){
        this.ws.send(sendresponse(`turtle.detect()`))
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block above the turtle.
    */
    async detectUp(){
        this.ws.send(sendresponse(`turtle.detectUp()`))
        return await this.receive(50)
    }

    /** 
     * 	Check if there is a solid block below the turtle.
    */
    async detectDown(){
        this.ws.send(sendresponse(`turtle.detectDown()`))
        return await this.receive(50)
    }

    /** 
     * 	Check if the block in front of the turtle is equal to the item in the currently selected slot.
    */
    async compareFront(){
        this.ws.send(sendresponse(`turtle.compare()`))
        return await this.receive(50)
    }

    /** 
     * 	Check if the block above the turtle is equal to the item in the currently selected slot.
    */
    async compareUp(){
        this.ws.send(sendresponse(`turtle.compareUp()`))
        return await this.receive(50)
    }

    /** 
     * 	Check if the block below the turtle is equal to the item in the currently selected slot.
    */
    async compareDown(){
        this.ws.send(sendresponse(`turtle.compareDown()`))
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity in front of the turtle with the tool on the specified side.
    */
    async attackFront(side?:string){
        this.ws.send(sendresponse(`turtle.attack(${side})`))
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity above the turtle with the tool on the specified side.
    */
    async attackUp(side?:string){
        this.ws.send(sendresponse(`turtle.attackUp(${side})`))
        return await this.receive(50)
    }

    /** 
     * 	Attack the entity below the turtle with the tool on the specified side.
    */
    async attackDown(side?:string){
        this.ws.send(sendresponse(`turtle.attackDown(${side})`))
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory in front of the turtle, or from an item floating in the world.
    */
    async suckFront(count?:number){
        this.ws.send(sendresponse(`turtle.suck(${count})`))
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory above the turtle, or from an item floating in the world.
    */
    async suckUp(count?:number){
        this.ws.send(sendresponse(`turtle.suckUp(${count})`))
        return await this.receive(50)
    }

    /** 
     * 	Suck an item from the inventory below the turtle, or from an item floating in the world.
    */
    async suckDown(count?:number){
        this.ws.send(sendresponse(`turtle.suckDown(${count})`))
        return await this.receive(50)
    }

    /**
     * Get the amount of fuel this turtle currently holds
     */
    async getFuelLevel(){
        this.ws.send(sendresponse(`turtle.getFuelLevel()`))
        return +(await this.receive(50)).slice(1,-1)
    }

    /**
     * Refuel this turtle
     */
    async refuel(count?:number){
        this.ws.send(sendresponse(`turtle.refuel(${count})`))
        return await this.receive(50)
    }

    /** 
     * 	Compare the item in the currently selected slot to the item in another slot.
    */
    async compareTo(slot:number){
        this.ws.send(sendresponse(`turtle.compareTo(${slot})`))
        return await this.receive(50)
    }

    /** 
     * 	Move a specified amount of items from the selected slot to another one.
    */
    async transferTo(slot:number, count?:string){
        if (count) {this.ws.send(sendresponse(`turtle.transferTo(${slot}, ${count})`))}
        else {this.ws.send(sendresponse(`turtle.transferTo(${slot})`))}
        return await this.receive(50)
    }

    /** 
     * 	Get the currently selected slot.
    */
    async getSelectedSlot(){
        this.ws.send(sendresponse(`turtle.getSelectedSlot()`))
        return await this.receive()
    }

    /** 
     * 	Get the maximum amount of fuel this turtle can hold.
    */
     async getFuelLimit(){
        this.ws.send(sendresponse(`turtle.getFuelLimit()`))
        return await this.receive(50)
    }

    /** 
     * 	Equips the currently selected item to the left slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
     async equipLeft(){
        this.ws.send(sendresponse(`turtle.equipLeft()`))
        var response = await this.receive(50)
    }

    /** 
     * 	Equips the currently selected item to the right slot of the turtle. If no item is selected only the currently equipped item will be unequipped.
    */
    async equipRight(){
        this.ws.send(sendresponse(`turtle.equipRight()`))
        return await this.receive(50)
    }

    /**
     * 	Get information about the block in front of the turtle.
     */
    async inspectForward(){
        this.ws.send(sendresponse(`turtle.inspect()`))
        return await this.receive(50)
    }

    /**
     * 	Get information about the block above the turtle.
     */
    async inspectUp(){
        this.ws.send(sendresponse(`turtle.inspectUp()`))
        return await this.receive(50)
    }

    /**
     * 	Get information about the block in front of the turtle.
     */
    async inspectDown(){
        this.ws.send(sendresponse(`turtle.inspectDown()`))
        return await this.receive(50)
    }

    /** 
     * 	Get detailed information about the items in the given slot. Boolean detailed gives even more info in exchange for taking longer to run.
    */
    async getItemDetail(slot?:number, detailed?:boolean){
        if (detailed) {this.ws.send(sendresponse(`turtle.getItemDetail(${slot}, ${detailed})`))}
        else {this.ws.send(sendresponse(`turtle.getItemDetail(${slot})`))}
        return await this.receive(50)
    }
}