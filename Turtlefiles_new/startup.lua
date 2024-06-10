-- Import a version of the turtle module that updates location
require("./tracker")

-- All functions that will be run in parallel with WScomm
parallelfuncs = {}

local function HandleMessage(message)
    if message.functions ~= nil then
        for _, func in pairs(message.functions) do
            load(func)()
        end
    end
    if message.get ~= nil then
        local response = {}
        for _, value in pairs(message.get) do
            response[value] = settings.get(value)
        end
        WShandle.send(textutils.serializeJSON(response))
    end

    if message.run ~= nil then
        parallelfuncs = {}
        for _, func in pairs(message.run) do
            table.insert(parallelfuncs, load(func))
        end
        return true
    end
    if message.stop ~= nil then
        parallelfuncs = {}
        return true
    end
end

function WScomm()
    while true do
        local eventData = {os.pullEvent()}

        if eventData[1] == "websocket_success" then
            WShandle = eventData[3]
            WShandle.send(textutils.serializeJSON({
                id = settings.get("ID"),
                driveid = settings.get("DriveID")
            }))
        elseif eventData[1] == "websocket_failure" or eventData[1] == "websocket_closed" then
            http.websocketAsync("ws://" .. settings.get("Server_URL"))
        elseif eventData[1] == "websocket_message" then
            if HandleMessage(textutils.unserialiseJSON(eventData[3])) then
                return
            end
        end
    end
end

http.websocketAsync("ws://" .. settings.get("Server_URL"))
while true do
    parallel.waitForAny(WScomm, table.unpack(parallelfuncs))
end
