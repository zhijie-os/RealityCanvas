class Event {
  constructor() {
    this.canvas = window.Canvas
    this.isPaint = false
  }

  mouseDown(pos) {
    console.log('mousedown')
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
    let points = this.lastLine.points()
    if (points[points.length-2] === pos.x && points[points.length-1] === pos.y) return
    let newPoints = points.concat([pos.x, pos.y])
    this.lastLine.points(newPoints)
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