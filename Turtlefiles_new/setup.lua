local this_version = "0.2.0"

function update_drive()

end

if arg[3] == "install" then
    settings.define("Turtlejs_version", {
        type = "string"
    })

    shell.run("wget https://github.com/Gopi200/Turtlejs/archive/refs/tags/0.2.0.zip")
end

if arg[3] == "update" then
    if arg[4] == "drive" then
        update_drive()
    end
end

settings.set("Turtlejs_version", this_version)

-- arg[3] is the actual argument
