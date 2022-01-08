import React, { Component } from 'react'

import Video from './Video'
import Speech from './Speech'
import Canvas from './Canvas'

const App = () => {
  return (
    <div id="container">
      <Canvas />
      <Video />
      <Speech />
    </div>
  )
}

export default App