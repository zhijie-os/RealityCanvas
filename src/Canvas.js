import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import Emit from './Emit'
import Event from './Event'
import Physics from './Physics'

window.Konva = Konva
let currentShape

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      mode: 'drawing',
      lines: [],
      currentPoints: [],
    }
  }

  componentDidMount() {
  }

  mouseDown(pos) {
    this.setState({ isPaint: true, currentPoints: [pos.x, pos.y, pos.x, pos.y] })
  }

  mouseMove(pos) {
    if (!this.state.isPaint) return false
    let points = this.state.currentPoints
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    points = points.concat([pos.x, pos.y])
    this.setState({ currentPoints: points })
  }

  mouseUp(pos) {
    let lines = this.state.lines
    if (this.state.currentPoints.length > 0) {
      lines.push({
        points: this.state.currentPoints,
        type: this.state.mode
      })
    }
    this.setState({ isPaint: false, lines: lines, currentPoints: [] })
    if (this.state.mode === 'emitter') {
      this.emit.start()
    }
  }

  changeMode(mode) {
    this.setState({ mode: mode })
  }

  color(mode) {
    if (mode === 'drawing') return 'red'
    if (mode === 'emitter') return 'blue'
    if (mode === 'motion') return 'purple'
    return 'black'
  }

  render() {
    return (
      <>
        <div style={{position: 'fixed', top: '10px', width:'100%', textAlign: 'center', zIndex: 1}}>
          <button>
            Animate
          </button>
          <button onClick={ this.changeMode.bind(this, 'drawing') }>
            Drawing Line
          </button>
          <button onClick={ this.changeMode.bind(this, 'motion') }>
            Motion Line
          </button>
          <button onClick={ this.changeMode.bind(this, 'emitter') }>
            Emitter Line
          </button>
        </div>

        <Stage width={ App.size } height={ App.size }>
          <Layer>
            <Text text="Try click on rect" />
            <Line
              points={ this.state.currentPoints }
              stroke={ 'black' }
            />
            <Emit
              canvas={ this }
            />
            { this.state.lines.map((line, i) => {
                return (
                  <Line
                    key={ i }
                    points={ line.points }
                    stroke={ this.color(line.type) }
                  />
                )
            })}
          </Layer>
        </Stage>
      </>
    )
  }
}

export default Canvas