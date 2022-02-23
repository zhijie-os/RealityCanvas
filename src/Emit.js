import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'

class Emit extends Component {
  constructor(props) {
    super(props)
    window.emit = this
    this.canvas = props.canvas
    this.canvas.emit = this
    this.state = {
      step: 0,
      emitPoints: [],
      elementPoints: []
    }
  }

  componentDidMount() {
    setInterval(() => {
      let step = this.state.step + 1
      if (step > 100) step = 0
      this.setState({ step: step })
    }, 100)
  }

  start() {
    let emitterLines = this.canvas.state.lines.filter(line => line.type === 'emitter')
    let emitterLine = emitterLines[0]
    if (!emitterLine) return false

    let points = emitterLine.points
    let emitPoints = []
    for (let i = 0; i < points.length; i = i + 2) {
      let x = points[i]
      let y = points[i+1]
      emitPoints.push({ x: x, y: y })
    }

    let drawingLines = this.canvas.state.lines.filter(line => line.type === 'drawing')
    if (drawingLines.length === 0) return false
    let elementPoints = drawingLines[0].points
    this.setState({ emitPoints: emitPoints, elementPoints: elementPoints })

    let step = 0
    let max = 10
    setInterval(() => {
      this.update(emitPoints, step, max)
      step++
      if (step > max) step = 0
    }, 100)
  }

  update(originPoints, step, max) {
    let offset = {
      x: 0,
      y: step * (1000/max),
    }
    let motionLine = _.last(this.canvas.state.lines.filter(line => line.type === 'motion'))
    if (motionLine) {
      let points = motionLine.points
      let i = Math.floor(points.length / (max * 2))
      let x = points[(step * i)*2] - points[0]
      let y = points[(step * i)*2+1] - points[1]
      offset = { x: x, y: y }
    }
    let newEmitPoints = originPoints.map((originPoint) => {
      return {
        x: originPoint.x + offset.x + Math.random() * 30,
        y: originPoint.y + offset.y + Math.random() * 30
      }
    })
    this.setState({ emitPoints: newEmitPoints })
  }


  render() {
    return (
      <>
        { this.state.emitPoints.map((point, i) => {
          return (
            <Line
              key={ i }
              x={ point.x - this.state.elementPoints[0] }
              y={ point.y - this.state.elementPoints[1]}
              points={ this.state.elementPoints }
              stroke={ 'green' }
            />
          )
        })}
      </>
    )
  }
}

export default Emit