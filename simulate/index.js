require("dotenv").config()
const fs = require("fs")
const path = require("path")

const dataArray = []

const { copyTestLoadLocation, copyTestSaveFile } = process.env

// .env
// copyTestLoadLocation: The folder to copy the run data from
// copyTestSaveFile: The file to save the test data to

console.log(`*** Qlik Skytech Run Simulator ***
Pulling data from ${copyTestLoadLocation}
Saving to ${copyTestSaveFile}`)

// find all the files in the test folder
const files = fs
  .readdirSync(copyTestLoadLocation)
  .filter(name => name.endsWith(".csv"))

files.forEach(file => {
  // load their data in to memory
  const fullPath = path.join(copyTestLoadLocation, file)
  const fileNumber = file.replace("ps_", "").replace(".csv", "")
  const data = fs.readFileSync(fullPath)
  dataArray.push({ num: parseInt(fileNumber), data })
})

// sort by timestamp
dataArray.sort((a, b) => a.num - b.num)

console.log("Data Loaded. Press <Enter> to run.")
process.stdin.once("data", function() {
  let latestHr
  const doNext = () => {
    // save the next file
    const nextData = dataArray.shift()
    fs.writeFileSync(copyTestSaveFile, nextData.data)
    hrend = process.hrtime(latestHr)
    console.info(
      `(${dataArray.length}) File saved, took ${hrend[0]}s ${hrend[1] /
        1000000}ms`
    )
    latestHr = process.hrtime()

    // keep going if there's still values
    if (dataArray.length > 0) setTimeout(doNext, 25)
    else process.exit(0)
  }
  latestHr = process.hrtime()
  doNext()
})
