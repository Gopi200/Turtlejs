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
  

local myURL = "ws://84.105.39.48:25565"
local ws = http.websocket(myURL)
if pcall(function() ws.send("label\n" .. os.getComputerLabel()) end) then
else ws.send("No label") end
local event, url, message
while true do
    repeat
        event, url, message = os.pullEvent("websocket_message")
    until url == myURL
    lines = {}
    for s in message:gmatch("[^\n]+") do
        table.insert(lines, s)
    end
    if lines[1] == "func-Any" then
        local func, err = load("return " .. tostring(lines[2]))
        if err then
            print("Command Error: " .. err)
        elseif func then
            t=table.tostring({func()})
            print(t)
            ws.send(os.getComputerLabel() .. "\n" .. t)
        end
    else if lines[1] == "func-None" then
        local func, err = load(tostring(lines[2]))
        if err then print("Command Error: " .. err)
        elseif func then func() end
    end
    end
    url = ""
end