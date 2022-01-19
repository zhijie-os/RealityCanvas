class Graph {
  constructor() {
    this.stage = Canvas.stage
    this.layer = Canvas.layer
    this.lineLayer = Canvas.lineLayer
    this.graphLayer = Canvas.graphLayer

    this.isPaint = false
    this.dataPoints = new Konva.Group({ x: 0, y: 0 })
    this.graphLayer.add(this.dataPoints)

    this.count = 0
    this.ok = false
  }

  switchDraggable(bool) {
    let nodes = Canvas.layer.children.filter(i => i.id())
    for (let node of nodes) {
      node.setDraggable(bool)
    }
  }

  mouseDown(pos) {
    console.log(pos)
    this.switchDraggable(false)
    this.isPaint = true
    // let pos = this.stage.getPointerPosition()
    this.axis = new Konva.Group({ x: 0, y: 0 })
    this.ticks = new Konva.Group({ x: 0, y: 0 })
    this.line = new Konva.Line({
      stroke: 'black',
      strokeWidth: 3,
      lineCap: 'round',
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    let id = this.lineLayer.children.length
    this.axis.labelId = id
    this.axis.axis = true
    this.axis.add(this.line)
    this.axis.add(this.ticks)
    this.graphLayer.add(this.axis)
  }

  mouseMove(pos) {
    if (!this.isPaint) return
    // e.evt.preventDefault()
    // const pos = this.stage.getPointerPosition()
    // this.update(this.axis, pos)
    let line = this.axis.children[0]
    let points = line.getPoints()
    points[2] = pos.x
    points[3] = pos.y
    let degree = this.getAngle(points)
    if (90 - degree < 20) {
      points[2] = points[0]
      this.axis.dir = 'vertical'
      this.ok = true
    }
    if (degree < 20) {
      points[3] = points[1]
      this.axis.dir = 'horizontal'
    }
    line.setPoints(points)
  }

  mouseUp(pos) {
    if (!this.isPaint) return
    this.isPaint = false
    this.switchDraggable(true)
    Canvas.event.mode = null

    if (this.axis.dir === 'horizontal') {
      this.axis.type = 'time'
    }
  }

  update() {
    this.count++
    for (let node of this.graphLayer.children) {
      if (node.axis) {
        this.updateAxis(node)
      }
    }
    if (this.count > 10) {
      this.count = 0
      this.updateGraph()
    }
  }

  updateGraph() {
    if (!this.timeScale || !this.normalScale) return
    if (!this.ok) return
    this.dataPoints.removeChildren()
    let dataItems = Canvas.parameterize.data
    let pointNode = new Konva.Circle({
      fill: 'red',
      radius: 2,
    })
    for (let item of dataItems) {
      for (let key of Object.keys(item)) {
        let value = item[key].value
        let time = item[key].time
        let x = this.timeScale(time)
        let y = this.normalScale(value)
        let point = pointNode.clone()
        point.x(x)
        point.y(y)
        this.dataPoints.add(point)
      }
    }
  }

  updateAxis(axis) {
    let line = axis.children[0]
    let points = line.getPoints()
    let rangePoints = [points[0], points[2]]
    if (axis.dir === 'horizontal') {
      rangePoints = [points[0], points[2]]
    }
    if (axis.dir === 'vertical') {
      rangePoints = [points[1], points[3]]
    }

    let items = []
    let num = 10
    if (axis.type === 'time') {
      let sec = 1000
      let range = num * sec
      let timeScale = d3.scaleTime()
        .domain([Date.now() - range, Date.now()])
        .range(rangePoints)
      this.timeScale = timeScale
      let tickFormat = d3.timeFormat("%S")
      let now = Math.floor(Date.now()/1000) * 1000
      for (let i = 0; i < num; i++) {
        let time = now - i * sec
        let pos = timeScale(time)
        let label = tickFormat(time)
        let item = { pos: pos, label: label }
        items.push(item)
      }
      items = items.reverse()
    } else {
      let min = -100
      let max = 1000
      let scale = d3.scaleLinear()
        .domain([min, max])
        .range(rangePoints)
      this.normalScale = scale
      let data = Canvas.parameterize.data
      for (let i = 0; i < num; i++) {
        let x = (max - min) / num * i
        let pos = scale(x)
        let label = x
        let item = { pos: pos, label: label }
        items.push(item)
      }
    }
    this.drawAxis(axis, items)
  }

  drawAxis(axis, items) {
    let line = axis.children[0]
    let ticks = axis.children[1]
    ticks.removeChildren()
    let points = line.getPoints()
    let x = points[0]
    let y = points[1]
    let tickLine = new Konva.Line({
      stroke: 'black',
      strokeWidth: 3,
      lineCap: 'round',
      points: [0, 0, 0, 0]
    })
    let tickLabel = new Konva.Text({
      x: 0,
      y: 0,
      fill: '#000',
      fontSize: 16,
      fontFamily: 'Arial',
      text: '',
      align: 'center',
      verticalAlign: 'middle'
    })
    tickLabel.align('center')
    tickLabel.verticalAlign('middle')
    for (let item of items) {
      let pos = item.pos
      let tick = tickLine.clone()
      let label = tickLabel.clone()
      label.setText(item.label)
      if (axis.dir === 'horizontal') {
        tick.setPoints([pos, y, pos, y+5])
        label.x(pos-10)
        label.y(y+10)
      }
      if (axis.dir === 'vertical') {
        label.align('right')
        tick.setPoints([x, pos, x-5, pos])
        label.x(x-40)
        label.y(pos-8)
      }
      ticks.add(tick)
      ticks.add(label)
    }
  }

  getAngle(points) {
    let dx = Math.abs(points[2] - points[0])
    let dy = Math.abs(points[3] - points[1])
    let theta = Math.atan2(dy, dx)
    let degree = theta / Math.PI * 180
    console.log(degree)
    return degree
  }


}

export default Graph