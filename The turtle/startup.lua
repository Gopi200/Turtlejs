data = {saveddata = {}, datamap = {{"URL", "x", "y", "z", "facing"},{URL="string",x="number",y="number",z="number",facing="string"}}}

function data.init()
  local datastring = fs.open("data.txt", "rb").readAll()
  local it = 0
  for s in datastring:gmatch("[^\n]+") do
    it = it+1
    if data.datamap[2][data.datamap[1][it]] == "string" then data.saveddata[data.datamap[1][it]] = s
    elseif data.datamap[2][data.datamap[1][it]] == "number" then data.saveddata[data.datamap[1][it]] = tonumber(s) end
  end
end

function data.update(key, val)
  data.saveddata[key] = val
  local datastring = ""
  for _, key in ipairs(data.datamap[1]) do
    datastring = datastring .. data.saveddata[key] .. "\n"
  end
  fs.open("data.txt", "wb").write(datastring:sub(1,-2))
end

function awaitconnect()
  ws = false
  while ws == false do
    ws = http.websocket(data.saveddata.URL)
  end
  ws.send("label\n" .. os.getComputerLabel())
  return ws
end

function table.val_to_str ( v )
  if "string" == type( v ) then
    v = string.gsub( v, "\n", "\\n" )
    if string.match( string.gsub(v,"[^'\"]",""), '^"+$' ) then
      return "'" .. v .. "'"
    end
    return '"' .. string.gsub(v,'"', '\\"' ) .. '"'
  else
    return "table" == type( v ) and table.tostring( v ) or
      tostring( v )
  end
end
  
function table.key_to_str ( k )
  if "string" == type( k ) and string.match( k, "^[_%a][_%a%d]*$" ) then
    return k
  else
    return "[" .. table.val_to_str( k ) .. "]"
  end
end
  
function table.tostring( tbl )
  local result, done = {}, {}
  for k, v in ipairs( tbl ) do
    table.insert( result, table.val_to_str( v ) )
    done[ k ] = true
  end
  for k, v in pairs( tbl ) do
    if not done[ k ] then
      table.insert( result,
        table.key_to_str( k ) .. "=" .. table.val_to_str( v ) )
    end
  end
  return "{" .. table.concat( result, "," ) .. "}"
end

function testore(blockdata)
  assert(type(blockdata[2]["tags"]) == "table", "No block", 2)
  if blockdata[2]["tags"]["forge:ores"] then return true
  else error("No ore") end
end

function mine(amount)
  for mineit= 1,amount do
    turtle.turnLeft()
    if pcall(testore,{turtle.inspectUp()}) then turtle.digUp() end
    if pcall(testore,{turtle.inspectDown()}) then turtle.digDown() end
    if pcall(testore,{turtle.inspect()}) then turtle.dig() end
    turtle.turnRight(); turtle.turnRight()
    if pcall(testore,{turtle.inspect()}) then turtle.dig() end
    turtle.turnLeft(); turtle.dig(); turtle.forward()
  end
  return "Finished mining"
end

if not fs.exists("startup.lua") then
  shell.run("set motd.enable false")
  fs.copy("disk/startup.lua", "startup.lua")
  if not fs.exists("disk/data.txt") then
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
  end
  fs.copy("disk/data.txt", "data.txt")
  rfile = fs.open("data.txt", "rb")
  URL = rfile.readLine()
  ws = false
  while ws == false do
    ws = http.websocket(URL)
  end
  ws.send("No label\n" .. rfile.readLine() .. " " .. rfile.readLine() .. " " .. rfile.readLine() .. " " .. rfile.readLine())
  os.setComputerLabel(ws.receive())
  os.reboot()
end

data.init()
ws = awaitconnect()
while true do
  local message = ws.receive()
  if message == nil then
    ws = awaitconnect()
  else
    local lines = {}
    for s in message:gmatch("[^\n]+") do
        table.insert(lines, s)
    end
    if lines[1] == "func-Any" then
      local func, err = load("return " .. tostring(lines[2]))
      if err then
          print("Command Error: " .. err)
      elseif func then
          t=table.tostring({func()})
          ws.send(os.getComputerLabel() .. "\n" .. t)
      end
    elseif lines[1] == "func-None" then
      local func, err = load(tostring(lines[2]))
      if err then print("Command Error: " .. err)
      elseif func then func() end
    end
  end
end