const csvLoad = require("../csv-load")
require("dotenv").config()
const WebSocket = require("ws")
const enigma = require("enigma.js")
const schema = require("enigma.js/schemas/12.170.2.json")
const uuidv4 = require("uuid/v4")
const fs = require("fs")

const { readDirectory, unprocessedFile, processedFile, engineUrl, appName, emptyFile } = process.env
// readDirectory: Where the script will be looking for timestamped CSV files
// unprocessedFile: The CSV file the engine does partial loads with
// processedFile: The CSV file where the engine does a full load with
// engineUrl: The url to the core engine
// appName: The name of the qlik app to load

// this is the header to place in the top of the unprocessed csv file
const headerLine =
  "Race ID,Badge,Course,Gates Total,Race Status,Time,Speed,Gates Passed,Errors,Edging Left,Edging Right,Gate Edging Left,Gate Edging Right,GeoPos N,GeoPos E,GeoPos H,Time Recorded"

let qixApp
let badgeObject
let badgeValue = "0"
let raceValue = ""

;(async () => {
  try {
    const session = enigma.create({
      schema,
      url: engineUrl,
      createSocket: url => new WebSocket(url)
    })
    const qix = await session.open()
    qixApp = await qix.openDoc(appName)
    try {
      await qixApp.createObject({
        qInfo: { qId: "Badge", qType: "GenericObject" },
        badge: "0",
        raceId: ""
      })
      await qixApp.doSave()
    } catch (err) {
      console.log("Looks like the badge object exists (that's a good thing)")
    }
    badgeObject = await qixApp.getObject("Badge")
    badgeObject.on("changed", async () => {
      checkBadge()
    })
    console.log(`*** Qlik Skytech Data Processor ***

    We'll be looking for csv files in ${readDirectory}
    We'll be saving our unprocessed file to ${unprocessedFile}
    We'll be appending our processed data to ${processedFile}
    Loaded, Waiting for Badge scan`)
    checkBadge()
  } catch (err) {
    console.log("Whoops! An error occurred.", err)
    process.exit(1)
  }
})()

const checkBadge = async () => {
  const layout = await badgeObject.getLayout()

  // check to make sure there's a badge ID and that we're not
  // currently looking for a badge already
  if (layout.badge && layout.badge != 0 && badgeValue === "0") {
    console.log(`Badge ${layout.badge} Assigned, Searching for Files...`)

    // grab the badge and Race IDs 
    badgeValue = layout.badge.toString()
    raceValue = layout.raceId
    csvLoad(readDirectory)

    // let's do a reload to try and keep the app fast
    console.log("Doing Reload")
    fs.copyFileSync(emptyFile, unprocessedFile)
    await qixApp.doReloadEx()
    await qixApp.doSave()

    startWatching()
  }
}

const removeDuplicates = (lines, statusToRemove, keepFirst) => {
  // get rid of lines where we only care about one value. The values
  // for Loading, On Start, FIN and DNF don't ever change, so we only
  // need one per race
  let newLines = [...lines]
  const linesWithDuplicates = newLines.filter(
    line => line.indexOf(`,${statusToRemove},`) >= 0
  )
  if (linesWithDuplicates.length === 0) return [newLines, !keepFirst]
  newLines = newLines.filter(line => line.indexOf(`,${statusToRemove},`) < 0)
  if (keepFirst) {
    newLines.push(linesWithDuplicates.shift())
  }
  return [newLines, true]
}

let loadingFound = false
let onStartFound = false
let finishedFound = false
const startWatching = async () => {
  // make sure we're actually looking for a badge here
  if (badgeValue !== "0") {
    // load all the current files
    let results = csvLoad(readDirectory, badgeValue, raceValue)

    // remove useless lines
    ;[results, loadingFound] = removeDuplicates(
      results,
      "Loading",
      !loadingFound
    )
    ;[results, onStartFound] = removeDuplicates(
      results,
      "On Start",
      !onStartFound
    )
    ;[results, finishedFound] = removeDuplicates(results, "FIN", !finishedFound)
    ;[results, finishedFound] = removeDuplicates(results, "DNF", !finishedFound)


    if (results.length > 0) {
      const start = process.hrtime()
      console.log(`Processing ${results.length} files.`)
      // add the current data to the master CSV in case the engine crashes and/or
      // the qlik app becomes corrupt
      fs.appendFileSync(processedFile, results.join("\n") + "\n")

      // add the main header and write to the unprocessedFile for partial load
      results.unshift(headerLine)
      fs.writeFileSync(unprocessedFile, results.join("\n"))

      // run a partial load and save the app
      const reload = await qixApp.doReloadEx({ qPartial: true })
      await qixApp.doSave()
      const hrend = process.hrtime(start)

      // empty the unprocessedFile for partial load
      fs.copyFileSync(emptyFile, unprocessedFile)

      console.info(
        "Done, took %ds %dms",
        hrend[0],
        hrend[1] / 1000000
      )
    } else {
      //console.log("no files...")
    }

    if (finishedFound) {
      // we've got an end point here
      console.log("Run Finished....Stop Looking for Files, waiting for Badge scan")
      loadingFound = false
      onStartFound = false
      finishedFound = false
      badgeValue = "0"
      raceValue = ""

      // update the badge/race ID object on the app
      const badgePatchProperties = [
        {
          qOp: "replace",
          qPath: "/badge",
          qValue: "0"
        },
        {
          qOp: "replace",
          qPath: "/raceId",
          qValue: '""'
        }
      ]
      await badgeObject.applyPatches(badgePatchProperties)
      await qixApp.saveObjects()
    }
    // run through again
    setTimeout(startWatching, 0)
  }
}
