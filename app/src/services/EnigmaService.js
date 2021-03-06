import enigma from "enigma.js"
import schema from "enigma.js/schemas/12.170.2.json"
import uuidv4 from "uuid/v4"

class EnigmaService {
  qix = null
  document = null
  initialized = false

  static instance = null

  async init() {
    if (!this.qix) {
      console.log("Creating Session...")
      const session = enigma.create({
        schema,
        url: `${process.env.REACT_APP_ENGINE_URL}/app/${uuidv4()}`,
        createSocket: url => new WebSocket(url)
      })
      console.log("Session Created. Opening...")
      this.qix = await session.open()
      this.document = await this.qix.openDoc(process.env.REACT_APP_SKI_APP)
      console.log("Document opened.")
      return this.document
    }
  }

  static createInstance() {
    const object = new EnigmaService()
    return object
  }

  static getInstance() {
    if (!EnigmaService.instance) {
      EnigmaService.instance = EnigmaService.createInstance()
    }
    return EnigmaService.instance
  }

  async getList(field, options, callback) {
    const properties = {
      qInfo: {
        qType: "field-list"
      },
      qListObjectDef: {
        qDef: {
          qFieldDefs: [field],
          qSortCriterias: [{ qSortByState: 1 }, { qSortByAscii: 1 }]
        },
        qShowAlternatives: true,
        // We fetch the initial three values (top + height),
        // from the first column (left + width):
        qInitialDataFetch: [
          {
            qTop: 0,
            qHeight: 10000,
            qLeft: 0,
            qWidth: 1
          }
        ]
      }
    }

    const listObject = await this.document.createSessionObject(properties)

    if (callback) listObject.on("changed", () => callback(listObject))

    await callback(listObject)
  }

  async clearSelections() {
    await this.document.clearAll()
  }

  async search(terms, fields) {
    const searchResults = await this.document.searchResults(
      { qSearchFields: fields },
      terms,
      { qOffset: 0, qCount: 20 }
    )
    if (searchResults.qSearchGroupArray.length > 0) {
      return await this.document.selectAssociations(
        { qSearchFields: fields },
        terms,
        0
      )
    } else {
      return false
    }
  }

  async getData(properties, callback) {
    const sessionObject = await this.document.createSessionObject(properties)

    if (callback) {
      sessionObject.on("changed", () => {
        callback(sessionObject)
      })
      await callback(sessionObject)
    }

    return sessionObject
  }

  async makeSelection(fieldName, selection) {
    const field = await this.document.getField(fieldName)
    await field.toggleSelect(selection)
  }

  async updateObject(variableName, patch) {
    let object = await this.document.getObject(variableName)
    await object.applyPatches(patch)
    await this.document.saveObjects()
  }
}

const enigmaService = EnigmaService.getInstance()
export default enigmaService
