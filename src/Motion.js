class Motion {

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


}

export default Motion
