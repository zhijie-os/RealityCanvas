class Parameterize {
  constructor() {
    this.stage = Canvas.stage
    this.layer = Canvas.layer
    this.lineLayer = Canvas.lineLayer

    this.isPaint = false
    this.data = []
  }

  switchDraggable(bool) {
    let nodes = Canvas.layer.children.filter(i => i.id())
    for (let node of nodes) {
      node.setDraggable(bool)
    }
  }

  mouseDown(e) {
    console.log(e)
    this.switchDraggable(false)
    this.isPaint = true
    let pos = this.stage.getPointerPosition()
    this.group = new Konva.Group({ x: 0, y: 0 })
    this.group.constraints = []
    this.line = new Konva.Line({
      stroke: 'blue',
      strokeWidth: 1,
      lineCap: 'round',
      points: [pos.x, pos.y, pos.x, pos.y]
    })
    let id = this.lineLayer.children.length
    this.label = new Konva.TextPath({
      x: 0,
      y: 0,
      fill: '#000',
      fontSize: 16,
      fontFamily: 'Arial',
      text: '',
      data: `M${pos.x},${pos.y} L${pos.x} ${pos.y}`,
      align: 'center'
    })
    this.group.labelId = id
    this.group.add(this.line)
    this.group.add(this.label)
    this.lineLayer.add(this.group)
    this.addConstraint(this.group, e, 'start')
  }

  mouseMove(e) {
    if (!this.isPaint) return
    e.evt.preventDefault()
    const pos = this.stage.getPointerPosition()
    this.update(this.group, pos)
  }

  mouseUp(e) {
    if (!this.isPaint) return
    this.isPaint = false
    this.switchDraggable(true)
    Canvas.event.mode = null
    this.addConstraint(this.group, e, 'end')
  }

  addConstraint(group, e, type) {
    if (type === 'end') {
      let line = group.children[0]
      let points = line.getPoints()
      let dx = Math.abs(points[2] - points[0])
      let dy = Math.abs(points[3] - points[1])
      let theta = Math.atan2(dy, dx)
      let degree = theta / Math.PI * 180
      console.log(degree)

      if (90 - degree < 10) {
        group.constraints.push({
          nodeId: null,
          type: 'end',
          align: 'vertical'
        })
      }
      if (degree < 10) {
        group.constraints.push({
          nodeId: null,
          type: 'end',
          align: 'horizontal'
        })
      }
      return
    }

    let node = e.target
    if (node !== this.stage) {
      group.constraints.push({
        nodeId: node.getAttr('id'),
        type: type,
        align: 'center'
      })
    }
  }

  updateAll() {
    let groups = Canvas.lineLayer.children

    let data = {}
    let now = Date.now()
    for (let group of groups) {
      this.update(group)
      data[group.labelId] = {
        value: group.labelValue,
        time: now,
      }
    }
    this.data.push(data)
    if (this.data.length > 400) {
      this.data.shift()
    }
  }

  update(group, pos=null) {
    let line = group.children[0]
    let label = group.children[1]
    let points = line.getPoints()
    if (pos) {
      points[2] = pos.x
      points[3] = pos.y
    }
    for (let constraint of group.constraints) {
      if (!constraint.nodeId) {
        if (constraint.align === 'horizontal') {
          points[3] = points[1]
        }
        if (constraint.align === 'vertical') {
          points[2] = points[0]
        }
        continue
      }
      let node = this.layer.find(`#${constraint.nodeId}`)[0]
      // let bb = this.getBoundingBox(node)
      if (constraint.type === 'start') {
        if (constraint.align === 'center') {
          points[0] = node.x()
          points[1] = node.y()
        }
      }
      if (constraint.type === 'end') {
        if (constraint.align === 'center') {
          points[2] = node.x()
          points[3] = node.y()
        }
      }
    }
    line.setPoints(points)
    let value = Math.floor(Math.sqrt((points[2]-points[0])**2 + (points[3]-points[1])**2))
    label.setText(`id_${group.labelId} = ${value}`)
    label.setData(`M${points[0]},${points[1]} L${points[2]} ${points[3]}`)
    group.labelValue = value
  }

  getAllSnapPoints() {
    this.snap = { x: [], y: []}
    let nodes = Canvas.layer.children.filter(i => i.id())
    for (let node of nodes) {
      let bb = this.getBoundingBox(node)
      this.snap.x.push([bb.cx, bb.x1, bb.x2])
      this.snap.y.push([bb.cy, bb.y1, bb.y2])
    }
    this.snap.x.flat()
    this.snap.y.flat()
    console.log(this.snap)
  }

  addAllLines() {
    this.lines.removeChildren()

    let nodes = Canvas.layer.children.filter(i => i.id())
    let lines = []
    for (let node of nodes) {
      let bb = this.getBoundingBox(node)
      lines.push({ p0: { x: bb.cx, y: bb.cy }, type: 'origin' })
      lines.push({ p0: { x: bb.cx, y: bb.cy }, type: 'horizontal' })
      lines.push({ p0: { x: bb.cx, y: bb.cy }, type: 'vertical' })
      node.bb = bb
    }
    console.log(lines)

    for (let lineInfo of lines) {
      this.addLine(lineInfo)
    }

  }

  addLine(info) {
    let points = []
    switch (info.type) {
      case 'origin':
        points = [0, 0, info.p0.x, info.p0.y]
        break
      case 'horizontal':
        points = [0, info.p0.y, 2000, info.p0.y]
        break
      case 'vertical':
        points = [info.p0.x, 0, info.p0.x, 2000]
        break
      default:
        return
    }
    const line = new Konva.Line({
      stroke: 'blue',
      strokeWidth: 1,
      lineCap: 'round',
      points: points
    })
    console.log(line)
    this.lines.add(line)
  }

  getBoundingBox(node) {
    let d = node.getData()
    let bb = svgPathBbox(d)
    let ox = (bb[0] + bb[2])/2
    let oy = (bb[1] + bb[3])/2
    let cx = node.x() + ox
    let cy = node.y() + oy
    let x1 = node.x() + bb[0]
    let x2 = node.x() + bb[2]
    let y1 = node.y() + bb[1]
    let y2 = node.y() + bb[3]
    let width = bb[2] - bb[0]
    let height = bb[3] - bb[1]
    let ratio = width / height
    let res = {
      cx: cx, cy: cy, width: width, height: height,
      x1: x1, x2: x2, y1: y1, y2: y2
    }
    return res
  }


}

export default Parameterize