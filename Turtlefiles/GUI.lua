settings.define("Turtlejs_version", {type="string"})
settings.define("Turtle_ID", {type="string"})

settings.set("Turtlejs_version", "0.2.0.0D")
settings.set("Turtle_ID", "1")

settings.save()

term.setCursorBlink(false)

function Writecenter(terminal, Y, text)
    X = math.floor((terminal.getSize()-#text)/2)
    terminal.setCursorPos(X, Y)
    terminal.write(text)
end

function Screeninit(connstatus, funcstatus)
    local screenx, screeny = term.getSize()
    paintutils.drawBox(1,1,screenx,screeny,colours.white)
    term.setBackgroundColour(colours.black)
    Writecenter(term.current(), 3, os.version()) --Craftos version
    Writecenter(term.current(), 4, "Turtlejs v" .. settings.get("Turtlejs_version")) --turtlejs version
    Writecenter(term.current(), 5, "Turtle ID " .. settings.get("Turtle_ID")) --Turtle id
    local topwindow = window.create(term.current(), 3, 6, screenx-4, screeny-7)

    function topwindow.writeconn(status)
        topwindow.setCursorPos(1, 1)
        topwindow.clearLine()
        Writecenter(topwindow, 1, "Connected: "..tostring(status))
    end
    topwindow.writeconn(connstatus)

    function topwindow.writefunc(status)
        topwindow.setCursorPos(1, 2)
        topwindow.clearLine()
        Writecenter(topwindow, 2, "Currently ".. status)
    end
    topwindow.writefunc(funcstatus)

    topwindow.bottom = window.create(topwindow, 1, 3, screenx-4, screeny-9)
    term.redirect(topwindow.bottom)
    return topwindow
end

local wind = Screeninit(false, "idle")