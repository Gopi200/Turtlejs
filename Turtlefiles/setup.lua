shell.run("set motd.enable false")
shell.run("wget", "https://raw.githubusercontent.com/Gopi200/Turtlejs/dev/Turtlefiles/json.lua", "/disk/json.lua")
shell.run("wget", "https://raw.githubusercontent.com/Gopi200/Turtlejs/dev/Turtlefiles/startup.lua", "/disk/startup.lua")
wfile = fs.open("disk/data.txt","wb")
print("What is the WebSocket URL?")
wfile.write(io.stdin:read() .. "\n")
print("What is my x coordinate?")
wfile.write(io.stdin:read() .. "\n")
print("What is my y coordinate?")
wfile.write(io.stdin:read() .. "\n")
print("What is my z coordinate?")
wfile.write(io.stdin:read() .. "\n")
print("Which direction am I facing?")
wfile.write(io.stdin:read())
wfile.close()
os.reboot()