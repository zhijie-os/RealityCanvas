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
    this.setState({ isPaint: false })
    if (this.state.currentPoints.length === 0) return false
    let lines = this.state.lines
    lines.push({
      points: this.state.currentPoints,
      type: this.state.mode,
      physics: true
    })
    this.setState({ lines: lines, currentPoints: [] })
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
          <Layer ref={ ref => (this.layer = ref) }>
            <Line
              points={ this.state.currentPoints }
              stroke={ 'black' }
            />
            { this.state.lines.map((line, i) => {
                return (
                  <Line
                    key={ i }
                    id={ `line-${i}` }
                    name={ `line-${i}` }
                    physics={ line.physics }
                    points={ line.points }
                    stroke={ this.color(line.type) }
                  />
                )
            })}
            <Emit
              canvas={ this }
            />
            <Physics
              canvas={ this }
            />
          </Layer>
        </Stage>
      </>
    )
  }
}

export default Canvas