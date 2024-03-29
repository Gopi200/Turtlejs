function forward()
  local succ, err = turtle.forward()
  if succ then
    local tab = {North=function() _G.data.update("z", _G.data.saveddata.z - 1) end, East=function() _G.data.update("x", _G.data.saveddata.x + 1) end, South=function() _G.data.update("z", _G.data.saveddata.z + 1) end, West=function() _G.data.update("x", _G.data.saveddata.x - 1) end}
    tab[_G.data.saveddata.Facing]()
  end
  return succ, err
end

function back()
  local succ, err = turtle.back()
  if succ then
    local tab = {North=function() _G.data.update("z", _G.data.saveddata.z + 1) end, East=function() _G.data.update("x", _G.data.saveddata.x - 1) end, South=function() _G.data.update("z", _G.data.saveddata.z - 1) end, West=function() _G.data.update("x", _G.data.saveddata.x + 1) end}
    tab[_G.data.saveddata.Facing]()
  end
  return succ, err
end

function up()
  local succ, err = turtle.up()
  if succ then
    _G.data.update("y", _G.data.saveddata.y + 1)
  end
  return succ, err
end

function down()
  local succ, err = turtle.down()
  if succ then
    _G.data.update("y", _G.data.saveddata.y - 1)
  end
  return succ, err
end

function turnLeft()
  local succ, err = turtle.turnleft()
  if succ then
    local tab = {North=function() _G.data.update("Facing", "West") end, East=function() _G.data.update("Facing", "North") end, South=function() _G.data.update("Facing", "East") end, West= function() _G.data.update("Facing", "South") end}
    tab[_G.data.saveddata.Facing]()
  end
  return succ, err
end

function turnRight()
  local succ, err = turtle.turnright()
  if succ then
    local tab = {North=function() _G.data.update("Facing", "East") end, East=function() _G.data.update("Facing", "South") end, South=function() _G.data.update("Facing", "West") end, West=function() _G.data.update("Facing", "North") end}
    tab[_G.data.saveddata.Facing]()
  end
  return succ, err
end

function dig(side)
  local succ, err = turtle.dig(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function digUp(side)
  local succ, err = turtle.digup(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function digDown(side)
  local succ, err = turtle.digdown(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function place(text)
  local succ, err = turtle.place(text)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function placeUp(text)
  local succ, err = turtle.placeup(text)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function placeDown(text)
  local succ, err = turtle.placedown(side)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function drop(count)
  local succ, err = turtle.drop(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function dropUp(count)
  local succ, err = turtle.dropup(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function dropDown(count)
  local succ, err = turtle.dropdown(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function suck(count)
  local succ, err = turtle.suck(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function suckUp(count)
  local succ, err = turtle.suckup(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function suckDown(count)
  local succ, err = turtle.suckdown(count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function transferTo(slot, count)
  local succ, err = turtle.transferto(slot, count)
  if succ then
    _G.data.update("Inventory", turtle.getInventory())
  end
  return succ, err
end

function equipLeft()
  local item = turtle.getItemDetail()
  local succ, err = turtle.equipleft()
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

function equipRight()
  local item = turtle.getItemDetail()
  local succ, err = turtle.equipright()
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