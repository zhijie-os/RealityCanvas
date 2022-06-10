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
    this.max = 30
    this.state = {
      step: 0,
      rects: [],
      bodyIds: []
    }
  }

  componentDidMount() {
    let engine = Matter.Engine.create()
    let runner = Matter.Runner.create()
    let render = Matter.Render.create({
      element: document.getElementById('physics-container'),
      engine: engine,
      options: {
        showPositions: true,
        showAngleIndicator: true,
        width: App.size,
        height: App.size,
        background: '#eee',
        wireframeBackground: 'none'
      }
    })
    this.engine = engine
    this.runner = runner
    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)
    Matter.Events.on(engine, 'afterUpdate', this.afterUpdate.bind(this))
    this.showBox()

    setInterval(() => {
      this.setState({ step: this.state.step + 1 })
    }, 100)
  }

  showBox() {
    let rect = { x: 400, y: 810, width: 810, height: 60 }
    let ground = Matter.Bodies.rectangle(rect.x, rect.y, rect.width, rect.height, { isStatic: true, mass: 10 })
    ground.id = 'ground'
    ground.restitution = 1
    Matter.Composite.add(this.engine.world, ground)
    this.setState({ rects: [rect] })
  }

  addBody(node, options = {}) {
    let id = node.getAttr('id')
    let bodyIds = this.state.bodyIds
    if (bodyIds.includes(id)) return
    let x = node.getAttr('x')
    let y = node.getAttr('y')
    let radius = node.getAttr('radius') || 20
    let body = Matter.Bodies.circle(x, y, radius, {
      render: {
        fillStyle: 'red',
        strokeStyle: 'red',
        lineWidth: 1,
      }
    })
    body.id = id
    body.restitution = 1
    Matter.Composite.add(this.engine.world, body)
    bodyIds.push(id)
    this.setState({ bodyIds: bodyIds })
  }

  applyPhysics(node, reset) {
    this.addBody(node)
    let id = node.getAttr('id')
    let index = this.engine.world.bodies.map(b => b.id).indexOf(id)
    let body = this.engine.world.bodies[index]
    let originPoint = node.getAttr('originPoint') || { x: 0, y: 0 }
    let x = body.position.x
    let y = body.position.y
    let degree = body.angle * 180 / Math.PI
    node.setAttrs({ x: x, y: y })
    node.rotation(degree)
    if (reset) {
      console.log('reset')
      let bodyIds = this.state.bodyIds
      _.pull(bodyIds, id)
      _.pullAt(this.engine.world.bodies, [index])
      this.setState({ bodyIds: bodyIds })
      node.setAttrs({ x: originPoint.x, y: originPoint.y })
    }
  }

  afterUpdate() {
    let reset = false
    if (this.state.step > this.max) {
      reset = true
      this.setState({ step: 0 })
    }
    for (let node of this.canvas.layer.children) {
      if (!node.getAttr('physics')) continue
      this.applyPhysics(node, reset)
    }
  }

  render() {
    return (
      <>
        {this.state.rects.map((rect, i) => {
          return (
            <Rect
              key={i}
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              offsetX={rect.width / 2}
              offsetY={rect.height / 2}
              stroke={'black'}
            />
          )
        })}
      </>
    )
  }

}

export default Physics