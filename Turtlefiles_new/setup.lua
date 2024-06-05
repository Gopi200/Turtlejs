local this_version = "0.2.0"

function decompfile(file, include_disk)
    local startline = file.readLine()
    if startline == nil then
        return false
    end

    local diskfile
    local filename = startline:sub(11)
    if filename:sub(1, 6) == "disk/" then
        diskfile = true
    end

    local curfile
    if diskfile == include_disk or not include_disk then
        curfile = fs.open(filename, "w")
    end

    local curdiskfile
    if not diskfile and include_disk then
        curdiskfile = fs.open("disk/turtle/" .. filename, "w")
    end

    while true do
        local curline = file.readLine()
        if curline:sub(1, 8) == "ENDFILE" then
            break
        end
        if diskfile == include_disk or not include_disk then
            curfile.writeLine(curline)
        end
        if not diskfile and include_disk then
            curdiskfile.writeLine(curline)
        end
    end
    return true
end

function get_new_files(include_disk)
    shell.run("wget https://github.com/Gopi200/Turtlejs/releases/download/" .. this_version ..
                  "/compiledlua.txt compiledlua.txt")

    local compiledfile = fs.open("compiledlua.txt", "r")

    local looping = true
    while looping do
        looping = decompfile(compiledfile)
    end

    fs.delete("compiledlua.txt")
end

function update(include_drive)
    local files = fs.list("./")

    for file in files do
        if file ~= "disk" and file ~= "rom" then
            if file ~= "data.txt" then
                fs.delete(file)
            end
        end
    end

    if include_drive then
        local files = fs.list("disk")

        for file in files do
            if file ~= "data.txt" then
                fs.delete(file)
            end
        end
    end

    get_new_files(include_drive)
end

if arg[3] == "install" then
    settings.define("Turtlejs_version", {
        description = "The current version of TurtleJS running on this turtle",
        type = "string"
    })
    settings.define("ID", {
        description = "The ID of this turtle according to the TurtleJS server",
        type = "number"
    })
    settings.define("pos", {
        description = "Position of this turtle formatted in {x,y,z,facing}",
        type = "table"
    })
    settings.define("WS_URL", {
        description = "URL for the WebSocket Server this turtle will connect to",
        type = "string"
    })
    settings.define("Equipment", {
        description = "Because the turtle can't detect which item(s) it has equipped on its own, that information is stored here formatted in {left,right}",
        type = "table"
    })
    settings.define("DriveID", {
        description = "The ID of this drive/the drive this turtle was made on, to distinguish between servers and such",
        type = "number"
    })

    get_new_files(true)
end

if arg[3] == "update" then
    update(arg[4] == "drive")
end

settings.set("Turtlejs_version", this_version)

if arg[4] == "drive" then
    settings.set("Turtlejs_version", this_version)
    settings.save("temp.settings")
    settings.clear()
    settings.load("disk/.settings")
    settings.set("Turtlejs_version", this_version)
    settings.save("disk/.settings")
    settings.clear()
    settings.load("temp.settings")
    fs.delete("temp.settings")
end

if arg[3] == "install" then
    settings.set("Turtlejs_version", this_version)
    settings.set("motd.enable", false)
    -- With GUI set up location, owner id, server, WS URL

    function Writecenter(terminal, Y, text)
        local X = math.floor((terminal.getSize() - #text) / 2)
        terminal.setCursorPos(X, Y)
        terminal.write(text)
    end

    term.clear()
    local screenx, screeny = term.getSize()
    paintutils.drawBox(1, 1, screenx, screeny, colours.white)
    term.setBackgroundColour(colours.black)

    term.setCursorPos(3, 4)
    term.write(">")

    local prompt = window.create(term.native(), 3, 3, screenx - 4, 1)
    local response = window.create(term.native(), 5, 4, screenx - 6, 1)

    term.redirect(response)
    response.setCursorPos(1, 1)

    prompt.write("What is my x coordinate?")
    local x = io.stdin.read()
    prompt.clear()
    response.clear()

    prompt.write("What is my y coordinate?")
    local y = io.stdin.read()
    prompt.clear()
    response.clear()

    prompt.write("What is my z coordinate?")
    local z = io.stdin.read()
    prompt.clear()
    response.clear()

    prompt.write("Which direction would turtles placed here be facing?")
    local facing = io.stdin.read()
    prompt.clear()
    response.clear()

    settings.set("pos", {x, y, z, facing})

    -- http request Drive ID

    settings.save("disk/.settings")
end

settings.save()
os.reboot()
