import React, { Component } from 'react'
import _ from 'lodash'
import Konva from 'konva'
import Morph from './Morph'
import Event from './Event'

window.Konva = Konva
let currentShape

class Canvas extends Component {
  constructor(props) {
    super(props)

    this.state = {
      num: 0,
      lastLine: null,
      ball: null,
      line: null,
    }
    this.animateLines = this.animateLines.bind(this)
    this.spawnFromEmitterLine = this.spawnFromEmitterLine.bind(this)
    this.spawnFromEmitterLineHorizontal = this.spawnFromEmitterLineHorizontal.bind(this)
    this.generateRandomIndex = this.generateRandomIndex.bind(this)
    this.motionPathLine = this.motionPathLine.bind(this)
  }

  componentDidMount() {
    window.Canvas = this

    this.stage = new Konva.Stage({
      container: 'konva',
      width: 1024,
      height: 1024
    })
    this.layer = new Konva.Layer()
    this.layer.getCanvas()._canvas.id = 'konva-1'
    this.stage.add(this.layer)
    this.numberOfLines = 0
    this.drawingMode = "animateLines"
    this.emitterLinePointsCopy = []

    this.morph = new Morph()
    this.normalAnimation = true
    this.loopAnimation = false
    this.verticalEmitter = false
    this.horizontalEmitter = false
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
      stroke: 'pink'
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
      
    this.morph.animate()
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

  generateRandomIndex() {
    this.randomIndex = Math.floor( Math.random() * this.emitterLinePointsCopy.length / 2 ) * 2
    console.log("random index", this.randomIndex)
    return this.randomIndex
  }

  render() {
    return (
      <>
        <div style={{position: 'fixed', top: '10px', width:'100%', textAlign: 'center', zIndex: 1}}>
          <button id = "animateButton" onClick={this.animateLines}>
            Animate
          </button>

          <button id = "emitterLineButton" onClick={this.spawnFromEmitterLine}>
            Vertical Emitter Line
          </button>

          <button id = "emitterLineButtonHorizontal" onClick={this.spawnFromEmitterLineHorizontal}>
              Horizontal Emitter Line
          </button>

          <button id = "motionPath" onClick={this.motionPathLine}>
              Motion Path
          </button>
        </div>

        <div id="workarea">
          <div id="konva" className="svgcanvas" style={{ position: 'relative' }}></div>
        </div>
      </>
    )
  }
}

export default Canvas