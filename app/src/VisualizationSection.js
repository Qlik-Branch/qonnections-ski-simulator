import React from "react"
import "./VisualizationSection.css"

function VisualizationSection(props) {
  return (
    <div className="VisualizationSection">
      <div className="title">{props.title}</div>
      {props.visualization}
    </div>
  )
}

export default VisualizationSection
