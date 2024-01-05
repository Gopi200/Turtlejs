_G.json = require "json"



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
    local tab = {North=function() _G.data.update("facing", "West") end, East=function() _G.data.update("facing", "North") end, South=function() _G.data.update("facing", "East") end, West= function() _G.data.update("facing", "South") end}
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

local originaldig = turtle.dig
function turtle.dig(side)
  local succ, err = originaldig(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaldigup = turtle.digUp
function turtle.digUp(side)
  local succ, err = originaldigup(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaldigdown = turtle.digDown
function turtle.digDown(side)
  local succ, err = originaldigdown(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalplace = turtle.place
function turtle.place(text)
  local succ, err = originalplace(text)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalplaceup = turtle.placeUp
function turtle.placeUp(text)
  local succ, err = originalplaceup(text)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalplacedown = turtle.placeDown
function turtle.placeDown(text)
  local succ, err = originalplacedown(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaldrop = turtle.drop
function turtle.drop(count)
  local succ, err = originaldrop(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaldropup = turtle.dropUp
function turtle.dropUp(count)
  local succ, err = originaldropup(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaldropdown = turtle.dropDown
function turtle.dropDown(count)
  local succ, err = originaldropdown(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalsuck = turtle.suck
function turtle.suck(count)
  local succ, err = originalsuck(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalsuckup = turtle.suckUp
function turtle.suckUp(count)
  local succ, err = originalsuckup(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalsuckdown = turtle.suckDown
function turtle.suckDown(count)
  local succ, err = originalsuckdown(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originaltransferto = turtle.transferTo
function turtle.transferTo(slot, count)
  local succ, err = originaltransferto(slot, count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalequipleft = turtle.equipLeft
function turtle.equipLeft()
  local item = turtle.getItemDetail()
  local succ, err = originalequipleft()
  if succ then
    local equipment = _G.data.saveddata.equipment
    if item then
      equipment[1] = {item.name, 1}
    else
      equipment[1] = {"",0}
    end
    _G.data.update("equipment", equipment)
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

local originalequipright = turtle.equipRight
function turtle.equipRight()
  local item = turtle.getItemDetail()
  local succ, err = originalequipright()
  if succ then
    local equipment = _G.data.saveddata.equipment
    if item then
      equipment[2] = {item.name, 1}
    else
      equipment[2] = {"",0}
    end
    _G.data.update("equipment", equipment)
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function turtle.getInventory()
  local inv = {}
  for it=1,16 do
      local item = turtle.getItemDetail(it)
      if item then
          table.insert(inv, {item.name, item.count})
      else
          table.insert(inv, {"", 0})
      end
  end
  return inv
end

function turtle.turnTo(direction)
  local dir = {North=1,East=2,South=3,West=4}
  local targetnum = dir[direction]
  local curnum = dir[_G.data.saveddata.facing]
  if curnum-targetnum == 3 then turtle.turnRight()
  elseif curnum-targetnum >= 1 then turtle.turnLeft() end
  if curnum-targetnum == 2 then turtle.turnLeft() end
end



function awaitconnect()
  ws = false
  while ws == false do
    ws = http.websocket(_G.data.saveddata.URL)
  end
  ws.send("label\n" .. os.getComputerLabel())
  return ws
end

function awaitsend(msg)
  if not pcall(_G.ws.send, msg) then
    _G.ws = awaitconnect()
  else return end
  _G.ws.send(msg)
end



_G.data = {Inventory = turtle.getInventory(), saveddata = {}, datamap = {{"URL", "x", "y", "z", "Facing", "ServerIP", "OwnerID", "Equipment", "TurtleID"},{URL="string",x="number",y="number",z="number",Facing="string",ServerIP="string",OwnerID="number",Equipment="table",TurtleID="number"}}}

function _G.data.init()
  local datastring = fs.open("data.txt", "rb").readAll()
  local it = 0
  for s in datastring:gmatch("[^\n]+") do
    it = it+1
    if _G.data.datamap[2][_G.data.datamap[1][it]] == "string" then _G.data.saveddata[_G.data.datamap[1][it]] = s
    elseif _G.data.datamap[2][_G.data.datamap[1][it]] == "number" then _G.data.saveddata[_G.data.datamap[1][it]] = tonumber(s) 
    elseif _G.data.datamap[2][_G.data.datamap[1][it]] == "table" then _G.data.saveddata[_G.data.datamap[1][it]] = load("return "..s)() end
  end
end

function _G.data.update(key, val)
  if key == "Inventory" then
    _G.data.Inventory = val
  else
    _G.data.saveddata[key] = val
    local datastring = ""
    for _, key in ipairs(_G.data.datamap[1]) do
      if key == "equipment" then
        datastring = datastring .. table.tostring(_G.data.saveddata[key]) .. "\n"
      else
        datastring = datastring .. _G.data.saveddata[key] .. "\n"
      end
    end
    fs.open("data.txt", "wb").write(datastring:sub(1,-2))
  end
  pcall(ws.send, "update\n".. _G.data.saveddata.TurtleID .. "\n" .. key .. "\n" .. json.encode(val))
end



if not fs.exists("startup.lua") then
  shell.run("set motd.enable false")
  fs.copy("disk/json.lua", "json.lua")
  fs.copy("disk/startup.lua", "startup.lua")
  fs.copy("disk/data.txt", "data.txt")
  rfile = fs.open("data.txt", "rb")
  if not os.getComputerLabel() then
    data.init()
    ws = false
    while ws == false do
      ws = http.websocket(data.saveddata.URL)
    end
    ws.send("No label\n" .. json.encode(data.saveddata) .. "\n" .. json.encode(data.Inventory))
    local setup = json.decode(ws.receive())
    os.setComputerLabel(setup[1])
    fs.open("data.txt", "a").write("\n"..setup[2])
  end
  os.reboot()
end



_G.data.init()
_G.ws = awaitconnect()
local message = nil
while true do
  local connected, message = pcall(_G.ws.receive)
  if message == nil or connected == false then
    _G.ws = awaitconnect()
  else
    local func, err = load(message)
    if err then
      _G.ws.send("status\n" .. os.getComputerLabel() .. "\nCompilation error: " .. err)
    elseif func then
      local status, err = pcall(func)
      if err then
        awaitsend("error\n" .. os.getComputerLabel() .. "\n" .. tostring(err))
      end
      awaitsend("status\n" .. os.getComputerLabel() .. "\n" .. tostring("Waiting"))
    end
  end
end