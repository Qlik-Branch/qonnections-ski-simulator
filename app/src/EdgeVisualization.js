import React, { useEffect } from "react"
import "./EdgeVisualization.css"
import gauge from "./Gauge"

function EdgeVisualization(props) {
  useEffect(() => {
    gauge(document.querySelector("#edgeVisualization"), {
      minValue: -90,
      curValue: props.edge,
      curSubValue: props.lastEdge,
      maxValue: 90
    })
  })

  return (
    <div className="EdgeVisualization">
      <div id="edgeVisualization" className="edgeArc" />
      <div className="edgeValue">
        {props.edge > 0 ? "+" : ""}
        {props.edge}
      </div>
    </div>
  )
}

export default EdgeVisualization
