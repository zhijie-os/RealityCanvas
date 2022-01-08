import Konva from 'konva'
import svgPathBbox from 'svg-path-bbox'

class Path extends Konva.Path {
  constructor(props) {
    super(props)
  }

  getBoundingBox(d) {
    this.d = this.getData()
    let bb = svgPathBbox(d)
    this.bb = bb
    this.cx = (bb[0] + bb[2])/2
    this.cy = (bb[1] + bb[3])/2
    this.width = bb[2] - bb[0]
    this.height = bb[3] - bb[1]
    this.ratio = ow / oh
    let res = {
      cx: this.cx, cy: this.cy, width: this.width, height: this.height
    }
    return res
  }

}

export default Path