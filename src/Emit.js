import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'

class Emit extends Component {
  constructor(props) {
    super(props)
    window.emit = this
    this.canvas = props.canvas
    this.canvas.emit = this
    this.max = 10

    this.state = {
      step: 0,
      originPoints: [],
      elementPoints: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      let step = this.state.step + 1
      if (step > this.max) step = 0
      this.setState({ step: step })
    }, 100)
  }

  // called by Canvas.js - mouseUp()
  start() {
    // get all emitters from Canvas.js
    let emitterLines = this.canvas.state.lines.filter(line => line.type === 'emitter')

    let emitterLine = emitterLines[0]
    if (!emitterLine) return false

    // get points of emitter line
    let points = emitterLine.points
    let bb = emitterLine.boundary
    let originPoints = []

    // make points as objects
    for (let i = 0; i < points.length; i = i + 2) {
      let x = points[i]
      let y = points[i + 1]
      originPoints.push({ x: x-bb.width, y: y })
    }

  
    let drawingLines = this.canvas.state.lines.filter(line => line.type === 'drawing')
    if (drawingLines.length === 0) return false
    // get the first ever drawn line
    let elementPoints = drawingLines[0].points

    // origin points = emitter points
    // element points = the points of the sketched object
    this.setState({ originPoints: originPoints, elementPoints: elementPoints })
  }

  update(originPoint) {

    let offset = {
      x: 0,
      y: - this.state.step * (1000 / this.max),
    }

    let motionLine = _.last(this.canvas.state.lines.filter(line => line.type === 'motion'))
    if (motionLine) {
      let points = motionLine.points
      let motionOrigin = { x: points[0], y: points[1] }
      let i = Math.floor(points.length / (this.max * 2))
      let x = points[(this.state.step * i) * 2] - motionOrigin.x
      let y = points[(this.state.step * i) * 2 + 1] - motionOrigin.y
      offset = { x: x, y: y }
    }

    return {
      x: originPoint.x + offset.x + Math.random() * 30,
      y: originPoint.y + offset.y + Math.random() * 30
    }
  }

  render() {
    return (
      <>
        {/* for every point on the emitter line, update y(fall down) and spawn */}
        {this.state.originPoints.map((originPoint, i) => {
          // render the points, every time
          let pos = this.update(originPoint)
          return (
            <Line
              key={i}
              id={`emitted-${i}`}
              name={`emitted-${i}`}
              physics={this.canvas.state.isPhysics}
              originPoint={originPoint}
              x={pos.x}
              y={pos.y}
              points={this.state.elementPoints}
              stroke={'green'}
            />
          )
        })}
      </>
    )
  }
}

export default Emit