import React, { Component } from 'react'
import Matter from 'matter-js'
import polyDecomp from 'poly-decomp'
import pathseg from 'pathseg'
import { Stage, Layer, Rect, Text, Line } from 'react-konva'
import Konva from 'konva'

class Physics extends Component {
  constructor(props) {
    super(props)
    window.Matter = Matter
    Matter.Common.setDecomp(polyDecomp)

    this.canvas = props.canvas
    this.canvas.physics = this
    this.state = {
      rects: [],
      bodyIds: []
    }
  }

  componentDidMount() {
    this.engine = Matter.Engine.create()
    this.runner = Matter.Runner.create()
    Matter.Runner.run(this.runner, this.engine)
    Matter.Events.on(this.engine, 'afterUpdate', this.afterUpdate.bind(this))
    this.showBox()
  }

  showBox() {
    let rect = { x: 400, y: 610, width: 810, height: 60 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true })
    Matter.Composite.add(this.engine.world, [ground])
    this.setState({ rects: [rect] })
  }

  addBody(node, options={}) {
    let id = node.getAttr('id')
    let bodyIds = this.state.bodyIds
    if (bodyIds.includes(id)) return
    let x = node.getAttr('x')
    let y = node.getAttr('y')
    let radius = 100 // TODO: change with bounding box
    let body = Matter.Bodies.circle(x, y, radius)
    Matter.Composite.add(this.engine.world, body)
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
  }

  applyPhysics(node) {
    this.addBody(node)
    let body = this.engine.world.bodies[1] // TODO: change this index
    let x = body.position.x
    let y = body.position.y
    let degree = body.angle * 180 / Math.PI
    node.setAttrs({ x: x, y: y })
    node.rotation(degree)
  }

  afterUpdate() {
    for (let node of this.canvas.layer.children) {
      if (!node.getAttr('physics')) continue
      this.applyPhysics(node)
    }
  }

  render() {
    return (
      <>
        { this.state.rects.map((rect, i) => {
          return (
            <Rect
              key={ i }
              x={ rect.x }
              y={ rect.y }
              width={ rect.width }
              height={ rect.height }
              stroke={ 'black' }
            />
          )
        })}
      </>
    )
  }

}

export default Physics