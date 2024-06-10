local up = turtle.up
function turtle.up()
    local res = {up()}
    if res[1] == true then
        local newpos = settings.get("pos")
        newpos[2] = newpos[2] + 1
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end

local down = turtle.down
function turtle.down()
    local res = {down()}
    if res[1] == true then
        local newpos = settings.get("pos")
        newpos[2] = newpos[2] - 1
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end

local forward = turtle.forward
function turtle.forward()
    local res = {forward()}
    if res[1] == true then
        local newpos = settings.get("pos")
        local editedpos = ({
            N = {0, -1},
            E = {1, 0},
            S = {0, 1},
            W = {-1, 0}
        })[newpos[4]]
        newpos[1], newpos[3] = newpos[1] + editedpos[1], newpos[3] + editedpos[2]
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end

local back = turtle.back
function turtle.back()
    local res = {back()}
    if res[1] == true then
        local newpos = settings.get("pos")
        local editedpos = ({
            N = {0, 1},
            E = {-1, 0},
            S = {0, -1},
            W = {1, 0}
        })[newpos[4]]
        newpos[1], newpos[3] = newpos[1] + editedpos[1], newpos[3] + editedpos[2]
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end

local turnLeft = turtle.turnLeft
function turtle.turnLeft()
    local res = {turnLeft()}
    if res[1] == true then
        local newpos = settings.get("pos")
        newpos[4] = ({
            N = "W",
            E = "N",
            S = "E",
            W = "S"
        })[newpos[4]]
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end

local turnRight = turtle.turnRight
function turtle.turnRight()
    local res = {turnRight()}
    if res[1] == true then
        local newpos = settings.get("pos")
        newpos[4] = ({
            N = "W",
            E = "N",
            S = "E",
            W = "S"
        })[newpos[4]]
        settings.set("pos", newpos)
        settings.save()
    end
    return table.unpack(res)
end
