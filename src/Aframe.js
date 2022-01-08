import React, { Component } from 'react'

import Canvas from './Canvas'
import Event from './Event'

class Aframe extends Component {
  constructor(props) {
    super(props)
    window.Scene = this
    this.state = {}
  }

  componentDidMount() {

    let hit = false
    let drawing = false

    AFRAME.registerComponent('drawable', {
      init: function() {
        let mesh = this.el.object3D.children[0]
        console.log(mesh)

        this.event = new Event()

        let size = 400
        let canvas = document.getElementById('konva-1')
        canvas.width = canvas.height = size
        let texture = new THREE.Texture(canvas)
        console.log(texture)
        let material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
        mesh.material = material
        this.mesh = mesh
        this.first = true

        this.el.addEventListener('click', (event) => {
          hit = true
        })

        this.el.addEventListener('raycaster-intersected', (event) => {
          hit = true
        })

        this.el.addEventListener('raycaster-intersected-cleared', (event) => {
          hit = false
        })

        this.el.addEventListener('mousedown', (event) => {
          drawing = true
        })

        this.el.addEventListener('mouseup', (event) => {
          drawing = false
          this.first = true
          this.event.mouseUp()
        })
      },

      tick: function() {
        this.mesh.material.map.needsUpdate = true
        if (hit && drawing) {
          let plane = document.querySelector('a-plane')
          let intersection = this.el.sceneEl.components.raycaster.getIntersection(plane)
          console.log(intersection)
          let point = intersection.point
          console.log(point)
          let mouse = {
            x: 400 * intersection.uv.x,
            y: 400 * (1- intersection.uv.y)
          }
          if (this.first) {
            this.event.mouseDown(mouse)
            this.first = false
          } else {
            this.event.mouseMove(mouse)
          }

        }
      }
    })

  }

  render() {
    return (
      <div>
        <a-scene cursor="rayOrigin: mouse">
          <a-camera look-controls="mouseEnabled: false; touchEnabled: false"></a-camera>
          <a-plane id="plane" drawable position="0 0 -4" rotation="0 0 0" width="4" height="4" color="#7BC8A4" shadow></a-plane>
        </a-scene>
        <Canvas />
      </div>
    )
  }
}

export default Aframe