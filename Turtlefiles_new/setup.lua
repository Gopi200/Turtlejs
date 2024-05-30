local this_version = "0.2.0"

function update_drive()

end

function decompfile(file)
    local startline = file.readLine()
    if startline == nil then
        return false
    end
    local curfile = fs.open(startline:sub(11), "w")
    while true do
        local curline = file.readLine()
        if curline:sub(1, 8) == "ENDFILE" then
            break
        end
        curfile.writeLine(curline)
    end
    return true
end

function get_new_files()
    shell.run("wget https://github.com/Gopi200/Turtlejs/releases/download/" .. this_version ..
                  "/compiledlua.txt compiledlua.txt")

    local compiledfile = fs.open("compiledlua.txt", "r")

    local looping = true
    while looping do
        looping = decompfile(compiledfile)
    end
end

if arg[3] == "install" then
    settings.define("Turtlejs_version", {
        type = "string"
    })

end

if arg[3] == "update" then
    if arg[4] == "drive" then
        update_drive()
    end
end

settings.set("Turtlejs_version", this_version)

-- arg[3] is the actual argument
