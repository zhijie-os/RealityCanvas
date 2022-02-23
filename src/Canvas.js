import React, { Component } from 'react'
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
    this.animateLines = this.animateLines.bind(this);
    this.spawnFromEmitterLine = this.spawnFromEmitterLine.bind(this);
    this.spawnFromEmitterLineHorizontal = this.spawnFromEmitterLineHorizontal.bind(this);
    this.generateRandomIndex = this.generateRandomIndex.bind(this);
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
    this.lineLayer = new Konva.Layer()
    this.lineLayer.getCanvas()._canvas.id = 'konva-2'
    this.graphLayer = new Konva.Layer()
    this.stage.add(this.layer)
    this.stage.add(this.lineLayer)
    this.stage.add(this.graphLayer)
    this.numberOfLines = 0
    this.drawingMode = "animateLines"
    this.emitterLinePointsCopy = []

    this.morph = new Morph()
    this.normalAnimation = true
    this.loopAnimation = false
    this.verticalEmitter = false
    this.horizontalEmitter = false

    this.stage.on('contextmenu', (e) => {
      // this.contextMenu.show(e)
    })
    this.stage.on('mousedown touchstart', (e) => {
      this.event.mouseDown(e)
    })
    this.stage.on('mousemove touchmove', (e) => {
      this.event.mouseMove(e)
    })
    this.stage.on('mouseup touchend', (e) => {
      this.event.mouseUp(e)
    })
    this.layer.on('dragmove', (e) => {
      this.event.dragMove(e)
    })
    this.layer.on('dragend', (e) => {
      this.event.dragEnd(e)
    })
    
    this.background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      listening: false,
      fill: 'white',
      opacity: 0.1,
    });
    this.layer.add(this.background);

    this.circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 10,
      fill: 'red'
    })
    this.layer.add(this.circle)
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