-- Import a version of the turtle module that updates location
require("./tracker")
Event = require("./eventhandler")

-- All functions that will be run in parallel with WScomm
parallelfuncs = {}

function addyield(func, ...)
    coroutine.yield()
    func(...)
end

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
            table.insert(parallelfuncs, coroutine.create(load(func)))
        end
        return true
    end
    if message.stop ~= nil then
        parallelfuncs = {}
        return true
    end
end

local function WebSocketSuccessHandler(URL, handle)
    WShandle = eventData[3]
    WShandle.send(textutils.serializeJSON({
        id = settings.get("ID"),
        driveid = settings.get("DriveID")
    }))
end

local function WebSocketMessageHandler(URL, content, bin)
    HandleMessage(textutils.unserialiseJSON(content))
end

local function WebSocketConnect()
    http.websocketAsync("ws://" .. settings.get("Server_URL"))
end

CheckOS = Event.startOSListener()
Event.addListener("websocket_success", WebSocketSuccessHandler)
Event.addListener("websocket_failure", WebSocketConnect)
Event.addListener("websocket_closed", WebSocketConnect)
Event.addListener("websocket_message", WebSocketConnect)
WebSocketConnect()

while true do
    CheckOS()
    for _, CR in pairs(parallelfuncs) do
        CheckOS()
        coroutine.resume(CR)
    end
end