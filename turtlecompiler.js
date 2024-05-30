import fs from "fs";

try {
  fs.rmSync("./compiledlua.txt");
} catch {}

function getfiles(dir) {
  var luafiles = [];

  var folder = fs.opendirSync(dir, "utf-8");

  while (true) {
    var file = folder.readSync();
    if (file == null) {
      break;
    }
    luafiles.push(dir + file.name);
  }

  return luafiles;
}

function getallfiles() {
  var entries = getfiles("./Turtlefiles_new/");
  let index = 0;
  while (index < entries.length) {
    console.log(`INDEX ${index}
    ENTRY ${entries[index]}`);
    if (entries[index].slice(-4) != ".lua") {
      entries.push(...getfiles(entries[index] + "/"));
      entries.splice(index, 1);
    } else {
      fs.appendFileSync(
        "./compiledlua.txt",
        `STARTFILE ${entries[index].slice(18)}\n${fs.readFileSync(
          entries[index],
          "utf-8"
        )}\nENDFILE\n`
      );
      index++;
    }
  }
  return entries;
}

console.log(getallfiles());
