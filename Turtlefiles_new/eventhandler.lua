local EventListeners = {}
local Event = {}

function Event.createType(name)
    EventListeners[name] = {}
end

function Event.removeType(name)
    table.remove(EventListeners, name)
end

function Event.addListener(eventtype, func)
    if EventListeners[eventtype] == nil then
        Event.createType(eventtype)
    end
    table.insert(EventListeners[eventtype], func)
end

function Event.trigger(eventtype, eventdata)
    for _, func in pairs(EventListeners[eventtype]) do
        func(eventdata)
    end
end

local function Oslistenerthread()
    while true do
        local eventdata = {os.pullEvent()}
        local eventtype = table.remove(eventdata, 1)
        Event.trigger(eventtype, eventdata)
    end
end

local function checkOs(CR)
    os.startTimer(0.05)
    coroutine.resume(CR)
end

function Event.startOSListener()
    return function() checkOs(coroutine.create(Oslistenerthread)) end
end

print(Event.startOSListener()())

return Event

--I have a function that looks for a websocket event, and kills the program if it's waited on
--To fix this i need to not ever wait on it. Is there a way to run it as a sub-function?