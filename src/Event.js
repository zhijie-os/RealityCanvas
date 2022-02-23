class Event {
  constructor() {
    this.canvas = window.Canvas
    this.isPaint = false
  }

  mouseDown(pos) {
    this.isPaint = true
    this.lastLine = new Konva.Line({
      stroke: (this.canvas.drawingMode === 'emitterLine') ? 'blue' : 'red',
      strokeWidth: 5,
      lineCap: 'round',
      name:  (this.canvas.drawingMode === 'emitterLine') ? 'emitterLine' : 'lineToAnimate',
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    this.canvas.layer.add(this.lastLine)
    
    if(this.canvas.drawingMode === 'emitterLine') {
      this.canvas.emitterLinePointsCopy.push(pos.x, pos.y, pos.x, pos.y)
    }
  }

  mouseMove(pos) {
    if (!this.isPaint) return
    if(this.canvas.drawingMode === 'emitterLine') {
      let newPoints = this.lastLine.points().concat([pos.x, pos.y])
      this.lastLine.points(newPoints)
    } else {
      let newPoints = this.lastLine.points().concat([pos.x, pos.y])
      this.lastLine.points(newPoints)
    }
  }

  mouseUp(pos) {
    if (!this.isPaint) return
    this.isPaint = false
    this.canvas.setState({ lastLine: this.lastLine })
    // if(this.canvas.drawingMode === 'emitterLine') {
    //   this.canvas.emitterLinePointsCopy.push(pos.x, pos.y)
    // }
  }

}

export default Event

