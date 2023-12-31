import Turtle from "./turtle"

export function sendresponse(message:string){
    return `_G.ws.send(os.getComputerLabel() .. \"\\n\" .. json.encode({${message}}))`
}

export const mine = function mine(distance?:number) {return `
function testore(blockdata)
    assert(type(blockdata[2]["tags"]) == "table", "No block", 2)
    if blockdata[2]["tags"]["forge:ores"] then return true
    else error("No ore") end
end

function mine(amount)
    for mineit= 1,amount do
        turtle.turnLeft()
        if pcall(testore,{turtle.inspectUp()}) then turtle.digUp() end
        if pcall(testore,{turtle.inspectDown()}) then turtle.digDown() end
        if pcall(testore,{turtle.inspect()}) then turtle.dig() end
        turtle.turnRight(); turtle.turnRight()
        if pcall(testore,{turtle.inspect()}) then turtle.dig() end
        turtle.turnLeft(); turtle.dig(); turtle.forward()
    end
    return "Finished mining"
end

${sendresponse(`mine(${distance})`)}`
}

export const getInventory = async function getInventory(turtle:Turtle){
    turtle.ws.send(`
    local inv = {}
    for it=1,16 do
        local item = turtle.getItemDetail(it)
        if item then
            table.insert(inv, turtle.getItemDetail(it))
        else
            table.insert(inv, {name="",count=0})
        end
    end
    ${sendresponse(`inv`)}
    `);
    return ((await turtle.receive()) as {[string:string]:string|number}[][])[0].map((val)=>Object.keys(val).map((nestval)=>val[nestval]))
}