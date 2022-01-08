import React, { Component } from 'react'

import * as THREE from 'three'

import Video from './Video'
import Speech from './Speech'
import Canvas from './Canvas'

import Scene from './Scene'

const App = () => {
  window.app = this
  window.App = this

  return (
    <div>
      <Scene />
    </div>
  )
}

export default App