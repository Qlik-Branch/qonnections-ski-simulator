import React, { useEffect, useState } from "react"
import "./GateVisualization.css"
import picasso from "picasso.js"
import objectDefinitions from "./assets/objectDefinitions.json"
import enigmaService from "./services/EnigmaService"

function GateVisualization() {
    let [sessionObject, setSessionObject] = useState(null)

  const convertHypercubeToData = layout => {
    const matrix = layout.qHyperCube.qDataPages[0].qMatrix
    const data = [["Gate", "Speed"]]
    matrix.forEach(point => {
      data.push([point[0].qNum, point[1].qNum])
    })
    return [{ type: "matrix", data }]
  }

  const updateValues = async model => {
    try {
      const layout = await model.getLayout()
      drawChart(convertHypercubeToData(layout))
    } catch(e) {
      console.log("Error updating values")
    }
  }

  const drawChart = async (data) => {
    picasso.chart({
      element: document.querySelector("#gateVisualization"),
      data,
      settings: {
        scales: {
          y: {
            data: { field: "Speed" },
            invert: true,
          },
          g: { data: { extract: { field: "Gate" } } }
        },
        components: [
          {
            type: "axis",
            dock: "left",
            scale: "y",
          },
          {
            type: "axis",
            dock: "bottom",
            scale: "g",
          },
          {
            key: "lines",
            type: "line",
            data: {
              extract: {
                field: "Gate",
                props: {
                  v: { field: "Speed" }
                }
              }
            },
            settings: {
              coordinates: {
                major: { scale: "g" },
                minor: { scale: "y", ref: "v" }
              },
              layers: {
                line: {}
              }
            }
          }
        ]
      }
    })
  }

  useEffect(() => {
    if (!sessionObject) {
        const getSessionObject = async () => {
          setSessionObject(
            await enigmaService.getData(
                objectDefinitions.gateSpeedDefinition,
                updateValues
              )
          )
        }
        getSessionObject()
      }
  })


  return <div id="gateVisualization" className="GateVisualization"></div>
}

export default GateVisualization