import React from "react"
import Header from "./Header"
import "./Preview.css"

function Preview(props) {
  return (
    <div className="Preview">
      <Header />
      <div className="greetings">
        Hello {props.participant.firstName} {props.participant.lastName}
      </div>
      <div className="instruction">On your mark, get set...</div>
      <div className="goContainer">
        <div className="actionButton" onClick={props.onStartRun}>
          GO!
        </div>
      </div>
    </div>
  )
}

export default Preview
