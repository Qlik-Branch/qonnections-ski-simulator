import React from "react"
import "./IconSection.css"

function IconSection(props) {
  return (
    <div className="IconSection">
      <div className="icon">
        <div className="iconBackground">
          <img src={props.icon} alt={props.iconText} />
        </div>
        <div>{props.iconText}</div>
      </div>
      <div className="text">
        <div>{props.text}</div>
        {props.subtext && <div className="subtext">{props.subtext}</div>}
      </div>
    </div>
  )
}

export default IconSection
