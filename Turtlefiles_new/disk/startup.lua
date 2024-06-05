if fs.exists("startup.lua") then
    shell.run("startup")
else
    -- copy everything from disk/turtle to ./
    local files = fs.list("disk/turtle/")

    for _, file in pairs(files) do
        fs.copy("disk/turtle/" .. file, file)
    end

    -- set up data on turtle
    settings.load("disk/.settings")

    -- register a turtle through api
    while true do
        local res = http.post("http://" .. settings.get("Server_URL") .. "/ID", "", {
            driveid = settings.get("DriveID")
        })
        local ID = res.readLine()
        if ID:sub(1, 7) ~= "Error: " then
            settings.set("ID", tonumber(ID))
            os.setComputerLabel(res.readLine())
        end
    end

    settings.save()
    os.reboot()
end
