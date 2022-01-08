import React, { Component } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

import Canvas from './Canvas'
import Event from './Event'

class Scene extends Component {
  constructor(props) {
    super(props)
    window.Scene = this
    this.state = {}

    this.max = 60
    this.type = 'horizontal'
    this.graph = 'dots'

    this.targets = {}

    this.width = 1000
    this.height = 800

    // this.width = 700
    // this.height = 600

    this.raycaster = new THREE.Raycaster()
    this.mouse2D = new THREE.Vector3(0, 10000, 0.5)
    this.radius = 1600
    this.theta = 90
    this.phi = 60
    this.onMouseDownPosition = new THREE.Vector2()
    this.onMouseDownPhi = 60
    this.onMouseDownTheta = 45
  }

  componentDidMount() {
    this.width = this.mount.clientWidth
    this.height = this.mount.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    camera.position.set(0, -50, 5) // ryo
    camera.up.set(0, 0, 1)

    renderer.setClearColor('#eee')
    renderer.setSize(this.width, this.height)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0

    this.scene = scene
    this.camera = camera
    this.controls = controls
    this.renderer = renderer

    this.mount.appendChild(this.renderer.domElement)
    this.init()
  }

  init() {
    // Mouse.init()
    // Grid.addGrid() ryo
    // Robot.addRobots()

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add(cube)

    var size = 400
    var canvas = document.getElementById('konva-1')
    // var ctx = canvas.getContext('2d')
    canvas.width = canvas.height = size;

    this.texture = new THREE.Texture(canvas)
    geometry = new THREE.PlaneGeometry( 30, 30 )
    material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide })
    // material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( geometry, material );
    this.scene.add( this.plane )

    this.event = new Event()
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false)

    this.renderScene()
    this.start()
  }

  onMouseDown(event) {
    console.log('mousedown')
    this.drawing = true
    this.getIntersection(event)

    if (this.drawing && this.intersect) {
      this.controls.enabled = false
      // event.target = this.event.stage
      let mouse = {
        x: 400 * this.intersect.uv.x,
        y: 400 * (1- this.intersect.uv.y)
      }
      this.event.mouseDown(mouse)
      let uv = this.intersect.uv
      console.log(uv)
    }

  }

  onMouseMove(event) {
    console.log('mousemove')
    this.getIntersection(event)
    if (this.drawing && this.intersect) {
      this.controls.enabled = false
      // event.target = this.event.stage
      let mouse = {
        x: 400 * this.intersect.uv.x,
        y: 400 * (1- this.intersect.uv.y)
      }
      this.event.mouseMove(mouse)
      let uv = this.intersect.uv
      console.log(uv)
    }
  }

  onMouseUp(event) {
    console.log('mouseup')
    this.drawing = false
    this.controls.enabled = true
    this.event.mouseUp(event)
  }

  getIntersection(event) {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)

    this.intersects = new THREE.Vector3()
    this.intersects = this.raycaster.intersectObjects([this.plane])
    if (this.intersects.length > 0) {
      this.intersect = this.intersects[0]
    } else {
      this.intersect = null
    }
  }

  changeCanvas() {
    var canvas = document.getElementById('konva-2')
    var ctx = canvas.getContext('2d')
    ctx.font = '20pt Arial';
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(new Date().getTime(), canvas.width / 2, canvas.height / 2);
  }

  renderScene() {
    let target = new THREE.Vector3(0, 10, 0)
    this.camera.lookAt(target)
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate.bind(this))
    }
  }

  animate() {
    this.controls.update()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate.bind(this))
    // Move.move()

    // var canvas = document.getElementById('konva-2')
    // this.texture = new THREE.Texture(canvas)
    // let geometry = new THREE.PlaneGeometry( 30, 30 )
    // let material.map = this.texture
    // material.needsUpdate = true
    // this.plane = new THREE.Mesh( geometry, material );
    this.texture.needsUpdate = true;
    // this.changeCanvas()
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
          // style={{ width: this.width, height: this.height }}
          ref={(mount) => { this.mount = mount }}
        />
        <Canvas />
        <canvas id="canvas2"></canvas>
      </div>
    )
  }
}

export default Scene