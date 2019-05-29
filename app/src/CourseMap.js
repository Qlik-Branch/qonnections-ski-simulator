import React, { useState, useEffect } from "react"
import "./CourseMap.css"
import GateCoordinates from "./assets/gates.json"
const idevio = window.idevio
const startPoint = { latitude: 37.457684, longitude: 128.60247 }

function CourseMap(props) {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [skier, setSkier] = useState(null)
  const [map, setMap] = useState(null)
  const [lineLayer, setLineLayer] = useState(null)
  const [data] = useState([])

  useEffect(() => {
    const loadIt = async () => {
      if (!mapLoaded) {
        await setMapLoaded(true)
        const map = new idevio.map.WebMap({
          div: "CourseMap",
          center: getCoordinates(),
          scale: 4000,
          baseMap: "satellite_mercator"
        })
        const dataLayer = new idevio.map.MarkerLayer(map, {
          name: "Position Marker",
          pickable: false
        })

        const gates = GateCoordinates.map(gate => {
          return {
            gate: gate[0],
            longitude: gate[1],
            latitude: gate[2],
            color: gate[3]
          }
        })
        addGates(dataLayer.getDataset(), gates)

        const skierIcon = new idevio.map.Icon({
          url: "https://files.idevio.com/shipicons/lightgreen1_0.png",
          anchorX: "MIDDLE",
          anchorY: "MIDDLE"
        })
        const lineLayer = new idevio.map.FeatureLayer(map, {
          name: "Lines",
          styles: [
            {
              type: "line",
              width: 2,
              color: "#005CB9",
              maxRes: 10000
            }
          ]
        })
        await setLineLayer(lineLayer.getDataset())
        await setMap(map)
        await setSkier(
          new idevio.map.Marker(dataLayer.getDataset(), {
            coordinate: getCoordinates(),
            label: props.name,
            style: { icon: skierIcon }
          })
        )
      }
      moveSkier()
    }
    loadIt()
  })

  const getGateIcons = () => {
    const red = new idevio.map.Icon({
      url: "https://files.idevio.com/shipicons/red0.png",
      anchorX: "MIDDLE",
      anchorY: "MIDDLE"
    })
    const blue = new idevio.map.Icon({
      url: "https://files.idevio.com/shipicons/blue0.png",
      anchorX: "MIDDLE",
      anchorY: "MIDDLE"
    })
    const white = new idevio.map.Icon({
      url: "https://files.idevio.com/shipicons/white0.png",
      anchorX: "MIDDLE",
      anchorY: "MIDDLE"
    })

    return { red, blue, white }
  }

  const addGates = (dataset, data) => {
    const gateIcons = getGateIcons()
    data.forEach(gate => {
      new idevio.map.Marker(dataset, {
        coordinate: [gate.latitude, gate.longitude],
        style: {
          icon: gateIcons[gate.color.toLowerCase()]
        }
      })
    })
  }

  const getCoordinates = () => {
    return [
      props.latitude === 0 ? startPoint.latitude : props.latitude,
      props.longitude === 0 ? startPoint.longitude : props.longitude
    ]
  }

  const moveSkier = () => {
    if (map && skier) {
      const coordinates = getCoordinates()
      map.setCenter(coordinates)
      skier.setCoordinates(coordinates)
      const previousCoordinates = data[data.length - 1]
      if (
        props.running &&
        previousCoordinates &&
        (previousCoordinates[0] !== coordinates[0] ||
          previousCoordinates[1] !== coordinates[1])
      ) {
        // new coordinate, new line
        addLine(previousCoordinates, coordinates)
      }
      data.push(coordinates)
    }
  }

  const addLine = (prev, current) => {
    const coordinates = [current, prev]
    new idevio.map.LineStringFeature(lineLayer, {
      coordinates
    })
  }

  return <div id="CourseMap" className="CourseMap" />
}

export default CourseMap
