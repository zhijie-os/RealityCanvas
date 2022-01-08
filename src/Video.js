import React, { Component } from 'react'

class Video extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
        (stream) => {
          var video = document.querySelector('video')
          video.srcObject = stream
          video.onloadedmetadata = (e) => {
          video.play()
        }
      },
      (err) => {
        console.log('The following error occured: ' + err.name)
      }
    )
  }

  render() {
    return (
      <video id="video"></video>
    )
  }
}

export default Video