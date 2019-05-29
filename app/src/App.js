import React, { useEffect, useState } from "react"

import "./App.css"
import enigmaService from "./services/EnigmaService"
import Start from "./Start"
import Preview from './Preview'
import Dashboard from './Dashboard'
import backgroundImage from "./assets/Mountains.svg"
import uuidv4 from 'uuid/v4'

var appStyle = {
  backgroundImage: `url(${backgroundImage})`
}

function App() {
  const [participantLoaded, setParticipantLoaded] = useState(false)
  const [participant, setParticipant] = useState({ firstName: "", lastName: "" })
  const [runStarted, setRunStarted] = useState(false)

  useEffect(() => {
    // Update the document title using the browser API
    const initEnigma = async () => {
      await enigmaService.init()
    }
    initEnigma()
  })

  const onBadgeScanned = badgeId => {
    const getCube = async () => {
      const hypercubeDefinition = createParticipantDefinition(badgeId)
      const hypercube = await enigmaService.getData(hypercubeDefinition)
      const layout = await hypercube.getLayout()
      const matrix = layout.qHyperCube.qDataPages[0].qMatrix[0]

      setParticipant({
        badge: matrix[0].qText,
        firstName: matrix[1].qText,
        lastName: matrix[2].qText
      })
      setParticipantLoaded(true)
    }
    getCube()
  }

  const onStartRun = async () => {
    const raceId = uuidv4()
    const badgePatchProperties = [{
      qOp: "replace",
      qPath: "/badge",
      qValue: participant.badge
    },
    {
      qOp: "replace",
      qPath: "/raceId",
      qValue: `"${raceId}"`
    }]
    await enigmaService.updateObject("Badge", badgePatchProperties)
    await enigmaService.makeSelection("Badge", participant.badge)
    setRunStarted(true)
  }

  const nextSkierClicked = async () => {
    setParticipant({ firstName: "", lastName: "" })
    setRunStarted(false)
    setParticipantLoaded(false)
    await enigmaService.clearSelections()
  }

  const createParticipantDefinition = (badgeID) => {
    return {
        qInfo: {    
          qType: "table",
          qId: "table_id"
        },
        labels: true,
        qHyperCubeDef: {
          qDimensions: [
            {
              qDef: {
                qFieldDefs: ["Badge"]
              }
            },
            {
              qDef: {
                qFieldDefs: ["First Name"]
              }
            },
            {
              qDef: {
                qFieldDefs: ["Last Name"]
              }
            }
          ],
            qMeasures: [
              {
                qDef: {
                  qDef: `=Sum({<Badge={'${badgeID}'}>}1)`
                }
              }
            ],
          qInitialDataFetch: [
            {
              qTop: 0,
              qHeight: 1,
              qLeft: 0,
              qWidth: 3
            }
          ],
          qSuppressZero: false,
          qSuppressMissing: true
        }
      }
    }

  return (
    <div className="App" style={appStyle}>
      {!participantLoaded && <Start onBadgeScanned={onBadgeScanned} />}
      {participantLoaded && !runStarted && <Preview participant={participant} onStartRun={onStartRun} />}
      {runStarted && <Dashboard participant={participant} nextSkierClicked={nextSkierClicked} />}
    </div>
  )
}

export default App
