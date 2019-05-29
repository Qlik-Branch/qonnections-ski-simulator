import React, { useEffect, useState } from "react"
import Header from "./Header"
import "./Dashboard.css"

import objectDefinitions from "./assets/objectDefinitions.json"

import enigmaService from "./services/EnigmaService"

import DashboardSection from "./DashboardSection"
import IconSection from "./IconSection"

//images
import imgFlag from "./assets/flag.png"
import imgError from "./assets/error.png"
import imgSpeed from "./assets/speed-80.png"
import imgStopwatch from "./assets/stopwatch.png"
import VisualizationSection from "./VisualizationSection"
import EdgeVisualization from "./EdgeVisualization"
import GateVisualization from "./GateVisualization"
import moment from "moment"
import CourseMap from "./CourseMap"

function Dashboard(props) {
  let [values, setValues] = useState({
    speed: 0,
    gates: 0,
    totalGates: 0,
    time: 0,
    status: "Loading",
    errors: 0,
    edging: 0,
    lastEdging: 0,
    course: "Initializing",
    latitude: 0,
    longitude: 0
  })
  let [sessionObject, setSessionObject] = useState(null)
  let [raceFinished, setRaceFinished] = useState(false)

  const checkNan = (value, replace = 0) => {
    if (isNaN(value)) return replace
    return value
  }

  const updateValues = async model => {
    try {
      const layout = await model.getLayout()
      const matrix = layout.qHyperCube.qDataPages[0].qMatrix[0]
      const edgingValue =
        checkNan(matrix[6].qNum) > 0
          ? -checkNan(matrix[6].qNum)
          : checkNan(matrix[7].qNum)
      const lastEdgingValue =
        checkNan(matrix[11].qNum) > 0
          ? -checkNan(matrix[11].qNum)
          : checkNan(matrix[12].qNum)
      const newValues = {
        speed: checkNan(matrix[0].qNum),
        gates: checkNan(matrix[1].qNum),
        totalGates: `/${checkNan(
          matrix[2].qNum
        )}`,
        time: moment(
          checkNan(matrix[3].qNum)
        ).format("mm:ss.SSS"),
        status: matrix[4].qText,
        errors: checkNan(matrix[5].qNum),
        edging: edgingValue,
        lastEdging: lastEdgingValue,
        course: matrix[8].qText,
        latitude: checkNan(matrix[9].qNum),
        longitude: checkNan(matrix[10].qNum)
      }
      setValues(newValues)
      if (newValues.status === "FIN" || newValues.status === "DNF") {
        setRaceFinished(true)
      }
    } catch (err) {
      console.error("issue with getting layout")
      console.error(err)
    }
  }

  useEffect(() => {
    if (!sessionObject) {
      const getSessionObject = async () => {
        setSessionObject(
          await enigmaService.getData(
            objectDefinitions.dashboardDefinition,
            updateValues
          )
        )
      }
      getSessionObject()
    }
  })

  const isRunning = () => {
    return values.status === "Racing"
  }

  const skierName = () =>
    `${props.participant.firstName} ${props.participant.lastName}`

  return (
    <div className="Dashboard">
      <Header
        raceFinished={raceFinished}
        nextSkierClicked={props.nextSkierClicked}
      />
      <div className="main">
        <div className="column">
          <DashboardSection text={skierName()} />
          <IconSection icon={imgStopwatch} iconText="Time" text={values.time} />
          <IconSection icon={imgError} iconText="Errors" text={values.errors} />
          <VisualizationSection
            title="Edge"
            visualization={<EdgeVisualization edge={values.edging} lastEdge={values.lastEdging} />}
          />
        </div>
        <div className="column">
          <DashboardSection text={values.status} />
          <IconSection
            icon={imgSpeed}
            iconText="Speed"
            text={values.speed}
            subtext="km/h"
          />
          <IconSection
            icon={imgFlag}
            iconText="Gates"
            text={values.gates}
            subtext={values.totalGates}
          />
          <VisualizationSection
            title="Avg Speed at Gate"
            visualization={<GateVisualization />}
          />
        </div>
        <div className="column">
          <VisualizationSection
            title={values.course}
            visualization={
              <CourseMap
                running = {isRunning()}
                latitude={values.latitude}
                longitude={values.longitude}
                name={skierName()}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
