class Motion {

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


  addBody(node, options={}) {
    let d = node.getAttr('data')
    let x = node.getAttr('x')
    let y = node.getAttr('y')
    let test = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    test.setAttribute('d', d)
    let vertexSets = Matter.Svg.pathToVertices(test)
    let body = Matter.Bodies.fromVertices(x, y, vertexSets, {
      render: {
        fillStyle: 'red',
        strokeStyle: 'red',
        lineWidth: 1
      }
    }, true)
    window.body = body
    if (options.isStatic) {
      Matter.Body.setStatic(body, true)
      body.restitution = 1 // make it bouncy
    }
    Matter.Composite.add(this.engine.world, body)
    if (options.constraint) {
      let constraint = Matter.Constraint.create({ pointA: options.constraint, bodyB: body })
      let mouseConstraint = Matter.Constraint.create({
        pointA: { x: 0, y: 0 },
        pointB: { x: 0, y: 0 }
      })
      mouseConstraint.body = body
      window.mouseConstraint = mouseConstraint
      Matter.Composite.addConstraint(this.engine.world, constraint)
      Matter.Composite.addConstraint(this.engine.world, mouseConstraint)
    }
    this.bodyIds.push(node.id())
  }

}

export default Motion
