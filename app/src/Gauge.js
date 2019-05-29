import * as d3 from "d3"

function renderChart(wrapper, curData) {
  if (!wrapper) {
    return
  }
  const {
    select: d3Select,
    range: d3Range,
    scaleLinear: d3ScaleLinear,
    line: d3Line,
    curveLinear: d3CurveLinear,
    arc: d3Arc,
    easeElastic: d3EaseElastic
  } = d3
  const width = parseInt(d3Select(wrapper).style("width"), 10)
  const height = parseInt(d3Select(wrapper).style("width"), 10) / 2
  const minValue = curData.minValue
  const maxValue = curData.maxValue
  const curValue = curData.curValue
  const curSubValue = curData.curSubValue
  const radius = height
  const majorTicks = 5
  const DURATION = 1500
  const ringWidth = 5
  const minAngle = -90
  const maxAngle = 90
  const range = maxAngle - minAngle
  const arrowColor = "#FF0000"
  const arc = d3Arc()
    .innerRadius(radius - ringWidth)
    .outerRadius(radius)
    .startAngle((d, i) => {
      const ratio = d * i
      return deg2rad(minAngle + ratio * range)
    })
    .endAngle((d, i) => {
      const ratio = d * (i + 1)
      return deg2rad(minAngle + ratio * range)
    })
  const svgData = d3Select(wrapper)
    .selectAll("svg")
    .data(["dummy data"])
  const tickData = d3Range(majorTicks).map(() => 1 / majorTicks)
  const svgEnter = svgData.enter().append("svg")
  svgEnter.attr("width", width)
  svgEnter.attr("height", height)
  const svgMerge = svgData.merge(svgEnter)
  const centerTx = centerTranslation(radius)
  // sections
  const arcsData = svgMerge.selectAll("g.arc").data(tickData)
  const arcsEnter = arcsData
    .enter()
    .append("g")
    .attr("class", "arc")
    .attr("transform", centerTx)
  arcsEnter
    .append("path")
    .attr("fill", "#005CB9")
    .attr("d", arc)
  arcsData.merge(arcsEnter)
  // labels on sections
  const scaleValue = d3ScaleLinear()
    .range([0, 1])
    .domain([minValue, maxValue])

  //first pointer
  const pointerWidth = 10
  const pointerHeadLengthPercent = 0.9
  const pointerHeadLength = Math.round(radius * pointerHeadLengthPercent)
  const pointerTailLength = 5
  const lineData = [
    [pointerWidth / 2, 0],
    [0, -pointerHeadLength],
    [-(pointerWidth / 2), 0],
    [0, pointerTailLength],
    [pointerWidth / 2, 0]
  ]
  const pointerLine = d3Line().curve(d3CurveLinear)
  const pointerData = svgMerge.selectAll("g.pointer").data([lineData])
  const pointerEnter = pointerData
    .enter()
    .append("g")
    .attr("class", "pointer")
    .attr("transform", centerTx)
  pointerEnter
    .append("path")
    .attr("d", pointerLine)
    .attr("transform", "rotate(" + minAngle + ")")
    .attr("fill", arrowColor)
  const pointerMerge = pointerData.merge(pointerEnter)
  const ratio = scaleValue(curValue)
  const newAngle = minAngle + ratio * range
  pointerMerge
    .select("path")
    .transition()
    .duration(DURATION)
    .ease(d3EaseElastic)
    .attr("transform", "rotate(" + newAngle + ")")

  // second pointer
  const secondPointerWidth = 10
  const secondPointerHeadLengthPercent = 0.6
  const secondPointerHeadLength = Math.round(
    radius * secondPointerHeadLengthPercent
  )
  const secondPointerTailLength = 5
  const secondLineData = [
    [secondPointerWidth / 2, 0],
    [0, -secondPointerHeadLength],
    [-(secondPointerWidth / 2), 0],
    [0, secondPointerTailLength],
    [secondPointerWidth / 2, 0]
  ]
  const secondPointerLine = d3Line().curve(d3CurveLinear)
  const secondPointerData = svgMerge
    .selectAll("g.pointer2")
    .data([secondLineData])
  const secondPointerEnter = secondPointerData
    .enter()
    .append("g")
    .attr("class", "pointer2")
    .attr("transform", centerTx)
  secondPointerEnter
    .append("path")
    .attr("d", secondPointerLine)
    .attr("transform", "rotate(" + minAngle + ")")
    .attr("fill", "rgba(255,0,0,.4")
  const secondPointerMerge = secondPointerData.merge(secondPointerEnter)
  const secondRatio = scaleValue(curSubValue)
  const secondNewAngle = minAngle + secondRatio * range
  secondPointerMerge
    .select("path")
    .transition()
    .duration(0)
    //.ease(d3EaseElastic)
    .attr("transform", "rotate(" + secondNewAngle + ")")
}
function centerTranslation(r) {
  return "translate(" + r + "," + r + ")"
}
function deg2rad(deg) {
  return (deg * Math.PI) / 180
}

export default renderChart
