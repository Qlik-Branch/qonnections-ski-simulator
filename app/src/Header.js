import React from "react"
import qlikLogo from "./assets/logo-core.png"
import skiLogo from "./assets/Ski_badge.png"
import qonnectionsLogo from "./assets/Qonnections_RGB.png"
import "./Header.css"

function Header(props) {
  const nextSkier = () => {
    if (props.nextSkierClicked) {
      props.nextSkierClicked()
    }
  }

  return (
    <div className="Header">
      <img className="ski" src={skiLogo} alt="Ski Badge" />
      {!props.raceFinished && (
        <img
          className="qonnections"
          src={qonnectionsLogo}
          alt="Qonnections 2019"
        />
      )}
      {props.raceFinished && (
        <div className="actionButton nextSkier" onClick={nextSkier}>
          Next Skier
        </div>
      )}
      <img className="qlik" src={qlikLogo} alt="Qlik" />
    </div>
  )
}

export default Header
