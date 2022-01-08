import React, { Component } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@three-ts/orbit-controls'

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
    const width = this.mount.clientWidth
    const height = this.mount.clientHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    camera.position.set(0, -50, 5) // ryo
    camera.up.set(0, 0, 1)

    renderer.setClearColor('#eee')
    renderer.setSize(width, height)

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

    var size = 256
    var canvas = document.getElementById('canvas2')
    var ctx = canvas.getContext('2d')

    canvas.width = canvas.height = size;

    this.texture = new THREE.Texture(canvas)
    geometry = new THREE.PlaneGeometry( 30, 30 )
    material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide })
    // material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, material );
    this.scene.add( plane );

    this.renderScene()
    this.start()
  }

  changeCanvas() {
    var canvas = document.getElementById('canvas2')
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
    this.texture.needsUpdate = true;
    this.changeCanvas()
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  render() {
    return (
      <div>
        <div
          id="canvas"
          style={{ width: this.width, height: this.height }}
          ref={(mount) => { this.mount = mount }}
        />
        <canvas id="canvas2"></canvas>
      </div>
    )
  }
}

export default Scene