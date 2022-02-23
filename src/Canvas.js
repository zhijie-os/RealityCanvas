import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'
import _ from 'lodash'
import Emit from './Emit'
import Event from './Event'
import Physics from './Physics'

window.Konva = Konva
let currentShape

let debug = false

class Canvas extends Component {
  constructor(props) {
    super(props)
    window.Canvas = this
    window.canvas = this
    this.state = {
      mode: 'drawing',
      lines: [],
      currentPoints: [],
      isPhysics: true
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
    let physics = (this.state.isPhysics && this.state.mode === 'drawing')
    let points = this.state.currentPoints
    let node = new Konva.Line({ points: points })
    let bb = node.getClientRect()
    let x = 0, y = 0, radius = Math.min(bb.width, bb.height)
    if (this.state.mode !== 'emitter') {
      x = bb.x + bb.width/2
      y = bb.y + bb.height/2
      points = points.map((num, i) => {
        return (i % 2 === 0) ? num - x : num - y
      })
    }
    lines.push({
      x: x, y: y,
      radius: radius,
      points: points,
      type: this.state.mode,
      physics: physics,
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

  enablePhysics() {
    this.setState({ isPhysics: !this.state.isPhysics })
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
          <input name="isGoing" type="checkbox" checked={this.state.isPhysics} onChange={this.enablePhysics.bind(this)} />Enable Physics
        </div>
        <div style={{ display: debug ? 'block' : 'none' }}>
          <div id="physics-container"></div>
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
                      x={ line.x }
                      y={ line.y }
                      radius={ line.radius }
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
        </div>
      </>
    )
  }
}

export default Canvas