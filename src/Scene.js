import React, { Component } from 'react'

// import * as THREE from 'three'
// import { OrbitControls } from '@three-ts/orbit-controls'
// import { ArToolkitProfile, ArToolkitSource, ArToolkitContext, ArMarkerControls} from 'arjs/three.js/build/ar-threex.js'


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
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    camera.position.set(0, 0, 50) // ryo
    // camera.up.set(0, 0, 1)

    // renderer.setClearColor('#eee')
    // renderer.setSize(this.width, this.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(new THREE.Color(), 0)
    renderer.setSize(640, 480)
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0px'
    renderer.domElement.style.left = '0px'

    /*
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enabled = true
    controls.maxDistance = 1500
    controls.minDistance = 0
    */

    this.scene = scene
    this.camera = camera
    // this.controls = controls
    this.renderer = renderer

    this.mount.appendChild(this.renderer.domElement)
    this.init()
  }

  init() {
    // Mouse.init()
    // Grid.addGrid() ryo
    // Robot.addRobots()

    var geometry = new THREE.BoxGeometry( 1, 1, 1 )
    var material = new THREE.MeshBasicMaterial( { color: "#433F81" } )
    var cube = new THREE.Mesh( geometry, material )
    cube.position.y = 1.0
    this.scene.add(cube)

    var size = 400
    var canvas = document.getElementById('konva-1')
    // var ctx = canvas.getContext('2d')
    canvas.width = canvas.height = size

    this.texture = new THREE.Texture(canvas)
    geometry = new THREE.PlaneGeometry( 3, 3 )
    material = new THREE.MeshBasicMaterial({ map: this.texture, side: THREE.DoubleSide })
    // material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} )
    this.plane = new THREE.Mesh( geometry, material )
    this.plane.position.y = 1.0
    this.scene.add( this.plane )

    this.event = new Event()
    this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this), false)
    this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false)
    this.renderer.domElement.addEventListener('mouseup', this.onMouseUp.bind(this), false)


    this.arToolkitContext = new THREEx.ArToolkitContext({
      cameraParametersUrl: 'camera_para.dat',
      detectionMode: 'mono'
    })

    this.arToolkitContext.init(() => {
      this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix())
    })

    this.arToolkitSource = new THREEx.ArToolkitSource({
      sourceType: 'webcam'
    })

    function onResize() {
      console.log(this.arToolkitSource)
      this.arToolkitSource.onResizeElement()
      this.arToolkitSource.copyElementSizeTo(this.renderer.domElement)
      if (this.arToolkitContext.arController !== null) {
        this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas)
      }
    }

    this.renderer.domElement.addEventListener('resize', () => {
      onResize.bind(this)()
    })

    this.arToolkitSource.init(() => {
      setTimeout(() => {
        onResize.bind(this)()
      }, 2000)
    })

    this.arMarkerControls = new THREEx.ArMarkerControls(this.arToolkitContext, this.camera, {
      type: 'pattern',
      patternUrl: 'patt.hiro',
      changeMatrixMode: 'cameraTransformMatrix'
    })

    this.renderScene()
    this.start()

  }

  onMouseDown(event) {
    console.log('mousedown')
    this.drawing = true
    this.getIntersection(event)

    if (this.drawing && this.intersect) {
      // this.controls.enabled = false
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
      // this.controls.enabled = false
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
    // this.controls.enabled = true
    this.event.mouseUp(event)
  }

  getIntersection(event) {
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1
    // this.mouse.x = (event.clientX / 640) * 2 - 1
    // this.mouse.y = - (event.clientY / 480) * 2 + 1
    this.raycaster.setFromCamera(this.mouse, this.camera)

    this.intersects = new THREE.Vector3()
    this.intersects = this.raycaster.intersectObjects([this.plane])
    if (this.intersects.length > 0) {
      this.intersect = this.intersects[0]
    } else {
      this.intersect = null
    }
  }

  renderScene() {
    let target = new THREE.Vector3(0, 0, 0)
    this.camera.lookAt(target)
    this.renderer.render(this.scene, this.camera)
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate.bind(this))
    }
  }

  animate() {
    // this.controls.update()
    this.renderScene()
    this.frameId = window.requestAnimationFrame(this.animate.bind(this))
    // Move.move()

    if (this.arToolkitSource.ready) {
      this.arToolkitContext.update(this.arToolkitSource.domElement)
      // this.scene.visible = this.camera.visible
    }

    this.texture.needsUpdate = true
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
      </div>
    )
  }
}

export default Scene