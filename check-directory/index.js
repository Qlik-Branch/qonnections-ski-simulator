const fs = require("fs")
const path = require("path")

module.exports = (filePath, options) => {
  const defaults = {
    create: true,
    isDirectory: true
  }
  options = { ...defaults, ...options }
  directory = options.isDirectory ? filePath : path.dirname(filePath)
  let directoryExists = fs.existsSync(directory)
  if (!directoryExists && options.create) {
    fs.mkdirSync(directory)
    directoryExists = true
  }
  return directoryExists
}
