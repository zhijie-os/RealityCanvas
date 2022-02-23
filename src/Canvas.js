import React, { Component } from 'react'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import _ from 'lodash'
import Konva from 'konva'
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
      num: 0,
      lastLine: null,
      ball: null,
      line: null,
      lines: [],
      currentPoints: [],
      mode: 'drawing'
    }
    // this.event = new Event(this)
    this.emit = new Emit(this)
    // this.physics = new Physics(this)
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
    lines.push({
      points: this.state.currentPoints,
      type: this.state.mode
    })
    this.setState({ isPaint: false, lines: lines, currentPoints: [] })
  }

  addPhysics() {
    let points = this.state.lastLine.points()
    let data = []
    for (let i = 0; i < points.length; i = i + 2) {
      let x = points[i]
      let y = points[i+1]
      data.push({ x: x, y: y })
    }
    // data = _.uniqBy(data, 'x', 'y')
    console.log(data)

    let path = new Konva.Path({
      x: 0,
      y: 0,
      strokeWidth: 5,
      stroke: 'red'
    });
    this.layer.add(path)
    let p = "M" + data[0].x + " " + data[0].y
    for (let i = 1; i < data.length; i++) {
      p = p + " L" + data[i].x + " " + data[i].y
    }
    path.setData(p)
    window.path = path
    console.log(path)
    path.id(`hoge-${Date.now()}`)
    this.path = path
    // this.physics.addBody(path)
    this.physics.addBodyApprox(path)
    this.state.lastLine.remove()
  }

  animate() {
    let points = this.state.lastLine.points()
    let data = []
    for (let i = 0; i < points.length; i = i + 2) {
      let x = points[i]
      let y = points[i+1]
      data.push({ x: x, y: y })
    }
    // data = _.uniqBy(data, 'x', 'y')
    console.log(data)

    let path = new Konva.Path({
      x: 0,
      y: 0,
      strokeWidth: 5,
      stroke: 'red'
    });
    this.layer.add(path)
    let p = "M" + data[0].x + " " + data[0].y
    for (let i = 1; i < data.length; i++) {
      p = p + " L" + data[i].x + " " + data[i].y
    }
    path.setData(p)
    window.path = path
    console.log(path)

    let steps = 50
    let pathLen = path.getLength()
    let step = pathLen / steps
    let frameCnt = 0, pos =0, pt

    this.animatedLineStorage = this.stage.find('.lineToAnimate')
    this.node = this.animatedLineStorage[0]

    this.tween = new Konva.Tween({
      node: this.animatedLineStorage[0],
      duration: 1,
      easing: Konva.Easings.EaseInOut,
      onUpdate: function() {
        pos = pos + 1;
        pt = path.getPointAtLength(pos * step)
        this.node.position({x: pt.x - this.node.attrs.points[0], y: pt.y - this.node.attrs.points[1]})
      },
      onFinish: function() {
        this.tween.reset()
        pos = 0
        console.log('hoge')
        pt = path.getPointAtLength(pos * step)
        this.node.position({x: pt.x - this.node.attrs.points[0], y: pt.y - this.node.attrs.points[1]})
        // this.node.position({x: this.node.attrs.points[0], y: this.node.attrs.points[1]})
        this.tween.play()
      },
      y: 0,
      x: 0,
      fill: 'red'
    })
    this.tween.play()
  }

  animateLines(e) {
    this.drawingMode = "animateLines"
    this.normalAnimation = true
    this.loopAnimation = false
    //this.emitterLinePointsCopy =  this.event.emitterLinePoints
    this.emit.animate()
  }
  
  changeMode(mode) {
    this.setState({ mode: mode })
  }

  render() {
    let drawingLines = this.state.lines.filter(line => line.type === 'drawing')
    let emitterLines = this.state.lines.filter(line => line.type === 'emitter')
    return (
      <>
        <div style={{position: 'fixed', top: '10px', width:'100%', textAlign: 'center', zIndex: 1}}>
          <button id = "animateButton" onClick={this.animateLines.bind(this)}>
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
            { drawingLines.map((line, i) => {
                return (
                  <Line
                    key={ i }
                    points={ line.points }
                    stroke={ 'red' }
                  />
                )
            })}
            { emitterLines.map((line, i) => {
              return (
                <Line
                  key={ i }
                  points={ line.points }
                  stroke={ 'blue' }
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