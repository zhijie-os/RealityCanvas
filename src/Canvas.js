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
      lines: []
    }
    this.event = new Event(this)
    this.emit = new Emit(this)
    this.physics = new Physics(this)
  }

  componentDidMount() {
    // this.numberOfLines = 0
    // this.drawingMode = "animateLines"
    // this.emitterLinePointsCopy = []

    // this.normalAnimation = true
    // this.loopAnimation = false
    // this.verticalEmitter = false
    // this.horizontalEmitter = false
  }

  mouseDown(pos) {
    this.isPaint = true
    let lines = this.state.lines
    lines.push({
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    this.setState({ lines: lines })
  }

  mouseMove(pos) {
    if (!this.isPaint) return false
    let lines = this.state.lines
    let current = _.last(lines)
    let points = current.points
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return false
    current.points = points.concat([pos.x, pos.y])
    lines[lines.length-1] = current
    console.log(lines)
    this.setState({ lines: lines })
  }

  mouseUp(pos) {
    this.isPaint = false
    // this.canvas.setState({ lastLine: this.lastLine })
    // if(this.canvas.drawingMode === 'emitterLine') {
    //   this.canvas.emitterLinePointsCopy.push(pos.x, pos.y)
    // }
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

  motionLine(e) {
    this.drawingMode = "motionLine"
    this.verticalEmitter = false
    this.horizontalEmitter = false
  }

  animateLines(e) {
    this.drawingMode = "animateLines"
    this.normalAnimation = true
    this.loopAnimation = false
    //this.emitterLinePointsCopy =  this.event.emitterLinePoints
    this.emit.animate()
  }
  
  spawnFromEmitterLine(e) {
    this.drawingMode = "emitterLine"
    this.verticalEmitter = true
    this.horizontalEmitter = false
  }
  
  spawnFromEmitterLineHorizontal(e) {
    this.drawingMode = "emitterLine"
    this.verticalEmitter = false
    this.horizontalEmitter = true
  }
  
  motionPathLine(e) {
    this.drawingMode = "emitterLine"
    this.verticalEmitter = true
    this.horizontalEmitter = true 
  }

  render() {
    return (
      <>
        <div style={{position: 'fixed', top: '10px', width:'100%', textAlign: 'center', zIndex: 1}}>
          <button id = "animateButton" onClick={this.animateLines.bind(this)}>
            Animate
          </button>
          <button id = "motionLineButton" onClick={this.motionLine.bind(this)}>
            Motion Line
          </button>
          <button id = "emitterLineButton" onClick={this.spawnFromEmitterLine.bind(this)}>
            Vertical Emitter Line
          </button>
          <button id = "emitterLineButtonHorizontal" onClick={this.spawnFromEmitterLineHorizontal.bind(this)}>
              Horizontal Emitter Line
          </button>
          <button id = "motionPath" onClick={this.motionPathLine.bind(this)}>
              Motion Path
          </button>
        </div>


        <Stage width={ App.size } height={ App.size }>
          <Layer>
            <Text text="Try click on rect" />
            { this.state.lines.map((line, i) => {
              return (
                <Line
                  key={ i }
                  points={ line.points }
                  stroke={ 'red' }
                />
              )
            })}
          </Layer>
        </Stage>
        {/*<div id="workarea">
          <div id="konva" className="svgcanvas" style={{ position: 'relative' }}></div>
        </div>*/}
      </>
    )
  }
}

export default Canvas