import React from "react"
import "./DashboardSection.css"

function DashboardSection(props) {
  return (
    <div className="DashboardSection">
      {props.text}
    </div>
  )
}

export default DashboardSection
