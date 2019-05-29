const fs = require('fs')
const path = require('path')
require('dotenv').config()

// .env
// dataFile: file being stored by the Skytech simulator
// saveDirectory: The directory to copy the data file to

const { dataFile, saveDirectory} = process.env

console.log(`*** Qlik Skytech Simulator Renamer ***
Copying the data file located at ${dataFile}
Saving it to ${saveDirectory}
`)

while(true) {
    try {
        // all we're doing here is moving the file created by the SkyTech Ski Simulator
        // Saving it to the saveDirectory with the file name being the current timestamp 
        fs.renameSync(dataFile, path.join(saveDirectory,`${Date.now()}.csv`))
    } catch(e) {}
}