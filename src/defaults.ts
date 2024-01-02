import Turtle from "./turtle"

export const acceptmessage = `_G.ws.receive()`

export const sendresponse = (message:string) => `_G.ws.send(os.getComputerLabel() .. "\\n" .. json.encode({${message}}))`

export const sendstatus = (message:string) => `_G.ws.send("status\\n" .. os.getComputerLabel() .. "\\n" .. "${message}")`

export async function mine(turtle:Turtle, distance?:number) {
    if (await turtle.statusgetter() == "Waiting") {
        turtle.ws.send(`
        function testore(blockdata)
            if blockdata[2]["tags"]["forge:ores"] then return true
            else error("No ore") end
        end

        function mine(previous, start)
            if previous ~= "down" then if pcall(testore, {turtle.inspectUp()}) then 
                    turtle.digUp()
                    turtle.up()
                    mine("up")
            end end
            if previous ~= "up" then if pcall(testore, {turtle.inspectDown()}) then 
                    turtle.digDown()
                    turtle.down()
                    mine("down")
            end end
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()
            if previous == "down" or previous == "up" then if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end end
            turtle.turnLeft()
            if pcall(testore, {turtle.inspect()}) then 
                turtle.dig()
                turtle.forward()
                mine()
            end
            turtle.turnLeft()

            if start then
            elseif previous == "up" then turtle.down()
            elseif previous == "down" then turtle.up()
            else turtle.back()
            end
        end

        function startmining(distance)
            ${sendstatus("Mining")}
            if distance then
                for i=1,distance do
                    turtle.dig()
                    turtle.forward()
                    mine(nil, true)
                end
            else
                local dir = {North={"z", -1}, East={"x", 1}, South={"z", 1}, West={"x", -1}}
                local it = _G.data.saveddata[dir[_G.data.saveddata.facing][1]] % 16
                if dir[_G.data.saveddata.facing][2] == -1 then it = it*-1-1 end
                local connected = true
                while true do
                    if it == 15 then
                        if connection then
                            ${sendstatus("Mining")}
                            local msg = ${acceptmessage}
                            if not msg then connection = false
                            elseif msg == "stop" then break end
                        else
                            _G.ws = http.websocket(_G.data.saveddata.URL)
                            if ws then connection = true end
                        end
                        it = -1
                    end
                    local moved = false
                    while not moved do
                        turtle.dig()
                        moved = turtle.forward()
                    end
                    mine(nil, true)
                end
            end
        end

        startmining(${distance})`)
        while (true){
            if (await turtle.statusawaiter() != "Mining"){break}
            else {turtle.ws.send("Continue")}
        }
    }
    else {
        await turtle.statusawaiter()
        turtle.ws.send("stop")
    }
    await turtle.statusawaiter()
}
