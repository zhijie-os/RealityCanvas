class Morph {
  constructor() {
    this.stage = Canvas.stage
    this.layer = Canvas.layer
    // this.lastLine = canvas.lastLine
  }

  init() {
    // this.lastLine = window.canvas.state.lastLine

    let points = Canvas.state.lastLine.points()
    this.d = `M ${points[0]} ${points[1]} `
    for (let i = 0; i < points.length-1; i = i+2 ) {
      let point = points[i]
      let next = points[i+1]
      this.d += `L ${point} ${next} `
    }

    let bb = this.getBoundingBox(this.d)
    let ratio = bb.width / bb.height
        this.ox = bb.x
    this.oy = bb.y

    // rectangle
    this.d0 = this.d
    this.d1 = 'M280,250L280,240L380,240L380,250Z'
    if (0.8 < ratio && ratio < 1.2) {
      // circle
      this.d1 = 'M280,250A200,200,0,1,1,680,250A200,200,0,1,1,280,250Z'
    }
    // d1 = 'M280,250L380,250'
    if (ratio < 0.2 || 10 < ratio) {
      let points = Canvas.state.lastLine.points()
      let last = points.length-1
      this.d1 = `M${points[0]},${points[1]}L${points[last-1]},${points[last]}`
    }

    this.d2 = this.translateToOrigin(this.d0, this.d1)
    this.d3 = this.scaleSize(this.d0, this.d2)
    this.d4 = this.translateToPosition(this.d, this.d3)

    this.g = new Konva.Group({ x: 0, y: 0 })
    this.layer.add(this.g)

  }

  animate() {
    this.init()

    let prev
    pasition.animate({
      from: this.d,
      to: this.d4,
      time: 100,
      // easing : function(){ },
      begin: (shapes) => {
        Canvas.state.lastLine.points([])
        Canvas.state.lastLine.destroy()
      },
      progress: (shapes, percent) => {
        this.g.removeChildren()
        for (let curves of shapes) {
          for (let curve of curves) {
            let d = `M${curve[0]},${curve[1]} C${curve[2]},${curve[3]} ${curve[4]},${curve[5]} ${curve[6]},${curve[7]}`
            let p = new Konva.Path({
              x: 0,
              y: 0,
              data: d,
              stroke: '#000',
              strokeWidth: 5,
            })
            this.g.add(p)
          }
        }
      },
      end: (shapes) => {
        console.log('end')
        this.g.removeChildren()
        // addBody(d1, ncx, ncy)

        let path = new Konva.Path({
          x: this.ox,
          y: this.oy,
          data: this.d3,
          stroke: '#000',
          strokeWidth: 5,
          draggable: true,
        })
        path.id(`path-${Canvas.state.num}`)
        this.layer.add(path)
        Canvas.setState({ num: Canvas.state.num+1 })
        // Canvas.physics.addBody(path)
      }
    })
  }

 getBoundingBox(d) {
    let d0 = d
    let ob = svgPathBbox(d0)
    let ox = (ob[0] + ob[2])/2
    let oy = (ob[1] + ob[3])/2
    let ow = ob[2] - ob[0]
    let oh = ob[3] - ob[1]
    let ratio = ow / oh
    let res = {
      x: ox, y: oy, width: ow, height: oh
    }
    return res
  }

  translateToOrigin(d0, d1) {
    let bb = svgPathBbox(d1)
    let tw = bb[2] - bb[0]
    let th = bb[3] - bb[1]
    let a = pathParse(d1).absNormalize({ transform: `translate(${-bb[0]-tw/2} ${-bb[1]-th/2})`})
    // + 30 for heart for some reason
    d1 = serializePath(a)
    return d1
  }

  scaleSize(d0, d1) {
    let ob = svgPathBbox(d0)
    let ow = ob[2] - ob[0]
    let oh = ob[3] - ob[1]

    let bb = svgPathBbox(d1)
    let tw = bb[2] - bb[0]
    let th = bb[3] - bb[1]
    let a = pathParse(d1).absNormalize({ transform: `scale(${(1/tw)*ow} ${(1/th)*oh})` })
    d1 = serializePath(a)
    return d1
  }

  translateToPosition(d0, d1) {
    let ob = svgPathBbox(d0)
    let ox = (ob[0] + ob[2])/2
    let oy = (ob[1] + ob[3])/2
    let a = pathParse(d1).absNormalize({ transform: `translate(${ox} ${oy})`})
    d1 = serializePath(a)
    return d1
  }

}

export default Morph