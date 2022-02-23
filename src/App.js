import React, { Component } from 'react'
import AFRAME from 'aframe'
import Canvas from './Canvas'
import Event from './Event'

class App extends Component {
  constructor(props) {
    super(props)
    window.app = this
    window.App = this
  }

  componentDidMount() {
    AFRAME.registerComponent('drawing-plane', {
      init: function() {
        this.event = new Event()
        this.mesh = this.el.object3D.children[0]
        this.size = 1024
        this.canvas = document.getElementById('konva-1')
        this.canvas.width = this.canvas.height = this.size
        let texture = new THREE.Texture(this.canvas)
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        this.mesh.material = material
        this.mesh.material.transparent = true
        this.camera = document.getElementById('camera')
        this.internalState = {
          dragging: false,
          initDrawing: true,
          distance: 0,
          raycaster: new THREE.Raycaster(),
        }
        this.el.sceneEl.addEventListener('mousedown', this.mouseDown.bind(this))
        this.el.sceneEl.addEventListener('mousemove', this.mouseMove.bind(this))
        this.el.sceneEl.addEventListener('mouseup', this.mouseUp.bind(this))
        this.el.sceneEl.addEventListener('onefingermove', this.fingerMove.bind(this))
        this.el.sceneEl.addEventListener('onefingerend', this.fingerUp.bind(this))
      },

      mouseDown(event) {
        this.internalState.dragging = true
      },

      mouseMove(event) {
        this.internalState.mouse = { x: event.clientX, y: event.clientY }
      },

      mouseUp(event) {
        this.internalState.dragging = false
        this.internalState.initDrawing = true
        this.event.mouseUp()
      },

      fingerMove(event) {
        this.internalState.mouse = { x: event.clientX, y: event.clientY }
        this.internalState.dragging = true
      },

      fingerUp(event) {
        this.internalState.dragging = false
        this.internalState.initDrawing = true
        this.event.mouseUp()
      },

      tick: function() {
        this.mesh.material.map.needsUpdate = true
        if (this.internalState.dragging) {
          const screenPositionX = this.internalState.mouse.x / window.innerWidth * 2 - 1
          const screenPositionY = this.internalState.mouse.y / window.innerHeight * 2 - 1
          const screenPosition = new THREE.Vector2(screenPositionX, -screenPositionY)

          this.threeCamera = this.camera.getObject3D('camera')
          this.internalState.raycaster.setFromCamera(screenPosition, this.threeCamera)
          const intersects = this.internalState.raycaster.intersectObject(this.el.object3D, true)
          if (intersects.length > 0) {
            const intersect = intersects[0]
            this.internalState.distance = intersect.distance
            let point = intersect.point
            let mouse = {
              x: this.size * intersect.uv.x,
              y: this.size * (1- intersect.uv.y)
            }
            if (this.internalState.initDrawing) {
              this.event.mouseDown(mouse)
              this.internalState.initDrawing = false
            } else {
              this.event.mouseMove(mouse)
            }
          }
        }
      }
    })
  }

  render() {
    return (
      <>
        <Canvas />
        <a-scene>
          <a-camera id="camera" look-controls="false" position="0 8 0" raycaster="objects: .cantap" cursor="fuse: false; rayOrigin: mouse;"></a-camera>
          <a-plane drawing-plane id="plane" class="cantap" position="0 5 -10" rotation="0 0 0" width="10" height="10" color="#7BC8A4"></a-plane>
        </a-scene>
      </>
    )
  }
}

export default App