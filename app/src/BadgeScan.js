import React from "react"
import QrReader from "react-qr-reader"

export default function BadgeScan(props) {
  const handleScan = async data => {
    if (data) {
      data = data.replace("@", "")
      if (props.badgeScanned) {
        props.badgeScanned(data)
      }
    }
  }

  const handleError = err => {
    console.error(err)
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: "200px", height: "200px" }}
      />
    </div>
  )
}
