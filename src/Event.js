class Event {

  constructor() {
    this.stage = Canvas.stage
    this.layer = Canvas.layer
    this.lineLayer = Canvas.lineLayer
    // this.lastLine = canvas.lastLine
    this.physics = Canvas.physics
    this.parameterize = Canvas.parameterize
    this.graph = Canvas.graph
    this.isPaint = false
    this.mode = null
    this.anim = null
    this.time = null
    this.animatedLineStorage = null
    this.emitterLinePoints = []
  }

  mouseDown(pos) {
    if (this.mode === 'parameterize') {
      this.parameterize.mouseDown(pos)
      return
    }
    if (this.mode === 'graph') {
      this.graph.mouseDown(pos)
      return
    }
    /*
    if (e.target !== this.stage) return
    this.isPaint = true
    let pos = this.stage.getPointerPosition()
    this.lastLine = new Konva.Line({
      stroke: 'red',
      strokeWidth: 5,
      lineCap: 'round',
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    this.layer.add(this.lastLine)
    */

    this.isPaint = true



    this.lastLine = new Konva.Line({
      stroke: (( Canvas.drawingMode === "emitterLine") ? 'blue' : 'red'),
      strokeWidth: 5,
      lineCap: 'round',
      name:  (( Canvas.drawingMode === "emitterLine") ? 'emitterLine' : 'lineToAnimate'),
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    this.layer.add(this.lastLine)
    
    if(Canvas.drawingMode === "emitterLine")
    {
      Canvas.emitterLinePointsCopy.push(pos.x, pos.y, pos.x, pos.y)
      // console.log(typeof(pos.x))
      // console.log(emitterLinePoints)

    }
  }

  mouseMove(pos) {
    if (this.mode === 'parameterize') {
      this.parameterize.mouseMove(pos)
      return
    }
    if (this.mode === 'graph') {
      this.graph.mouseMove(pos)
      return
    }
    if (!this.isPaint) return
    /*
    e.evt.preventDefault()
    const pos = this.stage.getPointerPosition()
    let newPoints = this.lastLine.points().concat([pos.x, pos.y])
    this.lastLine.points(newPoints)
    */

        if(Canvas.drawingMode === "emitterLine")
    {
      console.log("in emitter line")
      Canvas.emitterLinePointsCopy.push(pos.x, pos.y)
          let newPoints = this.lastLine.points().concat([pos.x, pos.y])
    this.lastLine.points(newPoints)
      // console.log(typeof(pos.x))
      // console.log(emitterLinePoints)

    }
    else{
    let newPoints = this.lastLine.points().concat([pos.x, pos.y])
    this.lastLine.points(newPoints)
    }
  }

  mouseUp(pos) {
    if (this.mode === 'parameterize') {
      this.parameterize.mouseUp(pos)
      return
    }
    if (this.mode === 'graph') {
      this.graph.mouseUp(pos)
      return
    }

    if (!this.isPaint) return

    this.isPaint = false
    Canvas.setState({ lastLine: this.lastLine })
    if(Canvas.drawingMode === "emitterLine")
    {
      console.log("in emitter line")
      Canvas.emitterLinePointsCopy.push(pos.x, pos.y)
      // console.log(typeof(pos.x))
      // console.log(emitterLinePoints)

    }




    //Canvas.morph.animate()
  }

  dragMove(e) {
    let target = e.target
    // console.log(target.x(), target.y())
    if (this.ball && this.line) {
      let body = window.mouseConstraint.body
      window.mouseConstraint.pointA = {
        x: target.x(),
        y: target.y()
      }
      window.mouseConstraint.bodyB = body
      window.mouseConstraint.pointB = {
        x: target.x() - body.position.x,
        y: target.y() - body.position.y
      }
      window.mouseConstraint.angleB = body.angle
      Matter.Sleeping.set(body, false)
      // window.mouseConstraint.bodyB = window.mouseConstraint.body
      // renderConstraint()

      let point0 = pathParse(this.line.getData()).result[0]
      let x = point0[1] + this.line.x()
      let y = point0[2] + this.line.y()
      return
    }

    this.parameterize.updateAll()

    // detect collision
    let bb = e.target.getClientRect()
    for (let child of this.layer.children) {
      if (child === target) continue
      let cb = child.getClientRect()
      if (this.haveIntersection(cb, bb)) {
        console.log('intersect')
        this.line = child
        this.ball = target
        let point = pathParse(this.line.getData()).result[1]
        // ['L', x, y]
        let x = point[1] + this.line.x()
        let y = point[2] + this.line.y()
        this.ball.setAttr('x', x)
        this.physics.addConstraint(this.line, this.ball)
      }
    }
  }

  dragEnd(e) {
    if (!window.mouseConstraint) return
    window.mouseConstraint.bodyB = null
    window.mouseConstraint.pointB = null
  }

  haveIntersection(bb1, bb2) {
    return !(
      bb2.x > bb1.x + bb1.width ||
      bb2.x + bb2.width < bb1.x ||
      bb2.y > bb1.y + bb1.height ||
      bb2.y + bb2.height < bb1.y
    )
  }


}

export default Event

