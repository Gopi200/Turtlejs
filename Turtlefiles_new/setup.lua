function update_drive()

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

-- arg[3] is the actual argument
