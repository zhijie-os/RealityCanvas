import React, { Component } from 'react'

import Video from './Video'
import Speech from './Speech'
import Canvas from './Canvas'

const App = () => {
  return (
    <a-scene>
      <a-camera position="0 0 3" rotation="-45 0 0">
        <a-cursor></a-cursor>
      </a-camera>

      <a-entity htmlembed>
        <div id="result-div">
          Hello World
          <i class="word">Hello</i><i class="word">World</i>
        </div>
      </a-entity>
      <a-image
        id="selected-image"
        src="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODg5NzJ8MHwxfHNlYXJjaHwxfHxjYXR8ZW58MHx8fHwxNjQxNDk5MTQ2&ixlib=rb-1.2.1&q=80&w=1080"
        position="0 1 0"
      ></a-image>
      <a-text
        class="cursor-listener"
        cursor-listener
        color="black"
        id="selected-text"
        value="Selected Text"
        position="0 0.4 0"
        width="3"
      ></a-text>
    </a-scene>
  )
}

export default App