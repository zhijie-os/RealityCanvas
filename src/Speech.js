import React, { Component } from 'react'

class Speech extends Component {
  constructor(props) {
    super(props)
    this.state = {
      finalTranscript: '',
      interimTranscript: ''
    }
  }

  componentDidMount() {
    window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
    this.recognition = new webkitSpeechRecognition()
    this.recognition.lang = 'en-US'
    this.recognition.interimResults = true
    this.recognition.continuous = true
    this.recognition.onresult = this.onResult.bind(this)
    this.recognition.start()
    this.test()
  }

  onResult(event) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      let transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        this.setState({
          finalTranscript: this.state.finalTranscript + transcript,
          interimTranscript: ''
        })
      } else {
        this.setState({
          interimTranscript: transcript,
        })
      }
    }
  }

  test() {
    this.setState({ finalTranscript: 'hello world snap ' })
  }

  showWord(transcript) {
    let words = transcript.split(' ')
    return (
      words.map((word, i) => {
        return <i key={i} className="draggable" id={`word-${i}-${word}`}>{word + ' '}</i>
      })
    )
  }

  render() {
    return (
      <div id="speech">
        Please speak something
        <div id="result-div">
          <span className="final">
            { this.showWord(this.state.finalTranscript) }
          </span>
          <span className="interim">
            { this.showWord(this.state.interimTranscript) }
          </span>
        </div>
      </div>
    )
  }
}

export default Speech