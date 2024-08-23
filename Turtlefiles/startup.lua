-- Import a version of the turtle module that updates location
--require("./mnt/tracker")
Event = require("./mnt/eventhandler")
for _,file in pairs(fs.list("/temp")) do
    fs.delete("/temp/"..file)
end

-- All functions that will be run in parallel with WScomm
function addyield(func, ...)
    coroutine.yield()
    func(...)
end

local function HandleMessage(message)
    if message.luafile ~= nil then
        for name, file in pairs(message.luafile) do
            local f = fs.open("/temp/"..name, "w")
            f.write(file)
            f.close()
            multishell.launch({}, "/temp/"..name)
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
        for _, func in pairs(message.run) do
            load(func)()
        end
        return true
    end

    if message.stop ~= nil then
        return true
    end
    return true
end

local function WebSocketSuccessHandler(URL, handle)
    print(handle)
    print(URL)
    WShandle = handle
    WShandle.send(textutils.serializeJSON({
        id = settings.get("ID"),
        driveid = settings.get("DriveID")
    }))
end

local function WebSocketMessageHandler(URL, content, bin)
    WShandle.send(textutils.serialiseJSON(HandleMessage(textutils.unserialiseJSON(content))))
end

local function WebSocketConnect()
    http.websocketAsync("ws://" .. settings.get("Server_URL"))
end

Event.addListener("websocket_success", WebSocketSuccessHandler)
Event.addListener("websocket_failure", WebSocketConnect)
Event.addListener("websocket_closed", WebSocketConnect)
Event.addListener("websocket_message", WebSocketMessageHandler)

local function testfunc()
    print(1)
    coroutine.yield()
    print(2)
    coroutine.yield()
    print(3)
end

WebSocketConnect()
Event.Oslistenerthread()
--parallel.waitForAny(testfunc, Event.Oslistenerthread)
print("Wuh oh")