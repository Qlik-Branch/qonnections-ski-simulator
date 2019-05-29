const fs = require("fs")
const path = require("path")

const skiDataToCsv = (data, filename, badge, race) => {
  // replacing any carriage returns and splitting by newline
  const splitData = data.replace("\r", "").split("\n")
  const newData = []
  splitData.forEach(line => {
    // Each line in the Skytech data is "Field Name;Var/Const;Value"
    // We really only care about the value
    newData.push(
      line
        .split(";")[2]
        .replace("\n", "")
        .replace("\r", "")
    )
  })
  // add the badgeID, Race ID and timestamp
  newData.unshift(badge)
  newData.unshift(race)
  newData.push(filename.replace(".csv", ""))
  // return a CSV Line
  return newData.join(",")
}

module.exports = (readDirectory, badge, race) => {
  const newLines = []
  // get all the csv files in the directory
  let files = fs.readdirSync(readDirectory)
  files = files.filter(name => name.endsWith(".csv"))

  files.forEach(file => {
    // read Each file, convert to CSV and add to array
    const filename = path.join(readDirectory, file)
    const data = fs.readFileSync(filename).toString()
    if (data.trim() !== "") {
      newLines.push(skiDataToCsv(data, file, badge, race))
    }
    // delete the file after
    fs.unlinkSync(filename)
  })
  return newLines
}
