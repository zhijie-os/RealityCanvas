class Event {
  constructor() {
    this.canvas = window.Canvas
    this.isPaint = false
  }

  mouseDown(pos) {
    console.log('mousedown')
    this.isPaint = true

    let color = 'red'
    let name = 'lineToAnimate'
    if (this.canvas.drawingMode === 'emitterLine') {
      color = 'blue'
      name = 'emitterLine'
    }
    if (this.canvas.drawingMode === 'motionLine') {
      color = 'green'
      name = 'motionrLine'
    }

    this.lastLine = new Konva.Line({
      stroke: color,
      strokeWidth: 5,
      lineCap: 'round',
      name: name,
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    this.canvas.layer.add(this.lastLine)
    // if(this.canvas.drawingMode === 'emitterLine') {
    //   this.canvas.emitterLinePointsCopy.push(pos.x, pos.y, pos.x, pos.y)
    // }
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