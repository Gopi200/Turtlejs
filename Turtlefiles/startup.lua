_G.data = {saveddata = {}, datamap = {{"URL", "x", "y", "z", "facing"},{URL="string",x="number",y="number",z="number",facing="string"}}}

function _G.data.init()
  local datastring = fs.open("data.txt", "rb").readAll()
  local it = 0
  for s in datastring:gmatch("[^\n]+") do
    it = it+1
    if _G.data.datamap[2][_G.data.datamap[1][it]] == "string" then _G.data.saveddata[_G.data.datamap[1][it]] = s
    elseif _G.data.datamap[2][_G.data.datamap[1][it]] == "number" then _G.data.saveddata[_G.data.datamap[1][it]] = tonumber(s) end
  end
end

function _G.data.update(key, val)
  _G.data.saveddata[key] = val
  local datastring = ""
  for _, key in ipairs(_G.data.datamap[1]) do
    datastring = datastring .. _G.data.saveddata[key] .. "\n"
  end
  fs.open("data.txt", "wb").write(datastring:sub(1,-2))
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



local originalfwd = turtle.forward
function turtle.forward()
  local succ, err = originalfwd()
  if succ then
    local tab = {North=function() _G.data.update("z", _G.data.saveddata.z - 1) end, East=function() _G.data.update("x", _G.data.saveddata.x + 1) end, South=function() _G.data.update("z", _G.data.saveddata.z + 1) end, West=function() _G.data.update("x", _G.data.saveddata.x - 1) end}
    tab[_G.data.saveddata.facing]()
  end
  return succ, err
end

local originalback = turtle.back
function turtle.back()
  local succ, err = originalback()
  if succ then
    local tab = {North=function() _G.data.update("z", _G.data.saveddata.z + 1) end, East=function() _G.data.update("x", _G.data.saveddata.x - 1) end, South=function() _G.data.update("z", _G.data.saveddata.z - 1) end, West=function() _G.data.update("x", _G.data.saveddata.x + 1) end}
    tab[_G.data.saveddata.facing]()
  end
  return succ, err
end

local originalup = turtle.up
function turtle.up()
  local succ, err = originalup()
  if succ then
    _G.data.update("y", _G.data.saveddata.y + 1)
  end
  return succ, err
end

local originaldown = turtle.down
function turtle.down()
  local succ, err = originaldown()
  if succ then
    _G.data.update("y", _G.data.saveddata.y - 1)
  end
  return succ, err
end

local originalturnleft = turtle.turnLeft
function turtle.turnLeft()
  local succ, err = originalturnleft()
  if succ then
    local tab = {North=function() _G.data.update("facing", "West") end, East=function() _G.data.update("facing", "North") end, South=function() _G.data.update("facing", "East") end, function() West=_G.data.update("facing", "South") end}
    tab[_G.data.saveddata.facing]()
  end
  return succ, err
end

local originalturnright = turtle.turnRight
function turtle.turnRight()
  local succ, err = originalturnright()
  if succ then
    local tab = {North=function() _G.data.update("facing", "East") end, East=function() _G.data.update("facing", "South") end, South=function() _G.data.update("facing", "West") end, West=function() _G.data.update("facing", "North") end}
    tab[_G.data.saveddata.facing]()
  end
  return succ, err
end



function awaitconnect()
  ws = false
  while ws == false do
    ws = http.websocket(_G.data.saveddata.URL)
  end
  ws.send("label\n" .. os.getComputerLabel())
  return ws
end





if not fs.exists("startup.lua") then
  fs.copy("disk/startup.lua", "startup.lua")
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



_G.data.init()
_G.ws = awaitconnect()
while true do
  local message = _G.ws.receive()
  if message == nil then
    _G.ws = awaitconnect()
  else
    local func, err = load(message)
    if err then
      _G.ws.send("status\n" .. os.getComputerLabel() .. "\nCompilation error: " .. err)
    elseif func then
      local status, err = pcall(func)
      if err then
        _G.ws.send("status\n" .. os.getComputerLabel() .. "\n" .. tostring(err))
      else _G.ws.send("status\n" .. os.getComputerLabel() .. "\n" .. tostring("done"))
      end
    end
  end
end