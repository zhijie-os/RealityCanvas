import React, { Component } from 'react'

import Aframe from './Aframe'

const App = () => {
  window.app = this
  window.App = this

  return (
    <div>
  <a-scene
    embedded
    arjs="trackingMethod: best; sourceType: webcam;"
  >
    <a-marker preset="hiro">
      <a-cone position='0 0.5 0' rotation="0 0 0" radius-bottom="0.5" material='opacity: 0.75; color: red;'></a-cone>
    </a-marker>
    <a-entity camera></a-entity>
  </a-scene>
      </div>
  )
}

export default App