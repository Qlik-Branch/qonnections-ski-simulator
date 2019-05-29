import React, { useState } from "react"
import BadgeScan from "./BadgeScan"
import Header from "./Header"
import "./Start.css"

function Start(props) {
  const [badgeScanned, setBadgeScanned] = useState(false)

  const handleBadgeScan = badgeId => {
    setBadgeScanned(true)
    if (props.onBadgeScanned) {
      props.onBadgeScanned(badgeId)
    }
  }

  return (
    <div className="Start">
      <Header />
      <div className="welcomeText">Welcome</div>
      <div className="scanText">Scan your badge to start</div>
      {!badgeScanned && (
        <BadgeScan className="badgeScan" badgeScanned={handleBadgeScan} />
      )}
      {badgeScanned && <div className="loading">Loading...</div>}
    </div>
  )
}

export default Start
