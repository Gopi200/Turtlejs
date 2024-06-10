local this_version = "1.0.1"

local function decompfile(file, normal, disk)
    local startline = file.readLine()
    if startline == nil then
        return false
    end
    local filename = startline:sub(11)

    local diskfile
    if filename:sub(1, 5) == "disk/" then
        diskfile = true
    end

    local curfile
    if normal or (diskfile and disk) then
        curfile = fs.open(filename, "w")
    end

    local curdiskfile
    if disk and not diskfile then
        curdiskfile = fs.open("disk/turtle/" .. filename, "w")
    end

    while true do
        local curline = file.readLine()
        if curline:sub(1, 7) == "ENDFILE" then
            break
        end
        if normal or (diskfile and disk) then
            curfile.writeLine(curline)
        end
        if disk and not diskfile then
            curdiskfile.writeLine(curline)
        end
    end
    return true
end

local function get_new_files(normal, disk)
    shell.run("wget https://github.com/Gopi200/Turtlejs/releases/download/" .. this_version ..
                  "/compiledlua.txt compiledlua.txt")

    local compiledfile = fs.open("compiledlua.txt", "r")

    local looping = true
    while looping do
        looping = decompfile(compiledfile, normal, disk)
    end

    fs.delete("compiledlua.txt")
end

local function update(include_drive)
    local files = fs.list("./")

    for _, file in pairs(files) do
        if file ~= "disk" and file ~= "rom" then
            if file ~= ".settings" then
                fs.delete(file)
            end
        end
    end

    if include_drive then
        local files = fs.list("disk")

        for _, file in pairs(files) do
            if file ~= ".settings" then
                fs.delete(file)
            end
        end
    end

    get_new_files(true, include_drive)
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
    settings.define("Server_URL", {
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

    get_new_files(false, true)
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

    -- TODO
    -- Use the leftover space at the bottom for debugging, make any errors print here (Might work now)
    -- Make the ui a little prettier by adding a label of the version and the fact that this is the setup
    -- Try to make the facing directon use buttons

    local function PromptUser(Thiswindow, inputstring)
        Thiswindow.setCursorPos(1, 1)
        Thiswindow.clear()
        local windowx, windowy = Thiswindow.getSize()
        local lines = {}
        local curline = ""
        for word in inputstring:gmatch("[^ ]+") do
            curline = curline .. word .. " "
            if #curline > windowx then
                table.insert(lines, #lines + 1, curline:sub(1, -(#word + 3)))
                curline = word .. " "
            end
        end
        local cury = 1
        for _, line in pairs(lines) do
            Thiswindow.write(line)
            cury = cury + 1
            Thiswindow.setCursorPos(1, cury)
        end

        Thiswindow.write(curline .. "\n")
        Thiswindow.setCursorPos(1, cury + 1)
        Thiswindow.write("> ")
        Thiswindow.setCursorBlink(true)
        local response = io.stdin:read()
        Thiswindow.clear()
        return response
    end

    term.clear()
    local screenx, screeny = term.getSize()
    paintutils.drawBox(1, 1, screenx, screeny, colours.white)
    term.setBackgroundColour(colours.black)
    term.setCursorPos(math.floor((term.getSize() - #this_version - 16) / 2), 3)
    term.write("TurtleJS setup v" .. this_version)

    local prompt = window.create(term.native(), 3, 5, screenx - 4, screeny - 6)
    term.redirect(prompt)

    local x = tonumber(PromptUser(prompt, "What is my x coordinate?"))

    local y = tonumber(PromptUser(prompt, "What is my y coordinate?"))

    local z = tonumber(PromptUser(prompt, "What is my z coordinate?"))

    local facing = PromptUser(prompt, "Which direction would turtles placed here be facing? (N|E|S|W)")

    local OwnerID = PromptUser(prompt, "Which ID does my owner have?")

    local serverID = PromptUser(prompt, "Which server am i on? (Use any identifier unique to this server)")

    settings.set("pos", {x, y, z, facing})

    -- http request Drive ID
    local Server_URL
    while true do
        Server_URL = PromptUser(prompt, "What is the IP:PORT of the TurtleJS server?")
        local res = http.post("http://" .. Server_URL .. "/setup", "", {
            ownerid = OwnerID,
            server = serverID
        })
        local ID = res.readLine()
        if ID:sub(1, 7) == "Error: " then
            print(ID)
            -- print the error, prompt server url again
        else
            settings.set("DriveID", tonumber(ID))
            break
        end
        os.sleep(10)
    end

    settings.set("Server_URL", Server_URL)
    term.redirect(term.native())
    term.clear()

    settings.save("disk/.settings")
end

settings.save()
os.reboot()
