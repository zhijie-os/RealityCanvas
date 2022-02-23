class Emit {
  constructor(canvas) {
    this.canvas = canvas
    this.tween = null
    this.animatedLineStorage = null
    this.tweenStorage = []
    this.counter = 0
    this.animate = this.animate.bind(this)
    this.replayAnimation = this.replayAnimation.bind(this)
  }

  animate() {
    this.animatedLineStorage = this.canvas.stage.find('.lineToAnimate')

    let emitterLine = this.canvas.stage.find('.emitterLine')[0]
    let canvas = this.canvas
    for(var i = 0; i < this.animatedLineStorage.length; i++) {
      let node = this.animatedLineStorage[i]
      this.tween = new Konva.Tween({
        node: node,
        duration: 1,
        easing: Konva.Easings.EaseInOut,
        onUpdate: () => {
        },
        onFinish: () => {
          if(this.canvas.normalAnimation === true) {
            let randomIndex = this.generateRandomIndex()
            let xRandomPos = emitterLine[randomIndex]
            let yRandomPos = emitterLine[randomIndex - 1]

            this.tween.reset()
            let updatedPoints = node.points()
            //updatedPoints[0] = xRandomPos
            console.log(xRandomPos)
            console.log(yRandomPos)
            //updatedPoints[1] = yRandomPos
            //this.node.points(updatedPoints)
            node.x(( xRandomPos - node.attrs.points[0] ))
            node.y( -1.5* (yRandomPos - node.attrs.points[1]))
            this.tween.play()
          }
        },
        // set new values for any attributes of a passed node
        y: (( this.canvas.verticalEmitter === true ? this.canvas.stage.height()  : 0)),
        x: (( this.canvas.horizontalEmitter === true ? this.canvas.stage.width() : 0)),
        fill: 'red'
      })
      this.tweenStorage.push(this.tween)
    }

    for(var j = 0; j < this.tweenStorage.length; j++) {
//       this.tweenStorage[j].reset()
      this.tweenStorage[j].play()
    }
  }

  generateRandomIndex() {
    let emitterLine = this.canvas.stage.find('.emitterLine')[0]
    this.randomIndex = Math.floor( Math.random() * this.emitterLine.length / 2 ) * 2
    console.log("random index", this.randomIndex)
    return this.randomIndex
  }

  replayAnimation(counter) {
    this.counter = counter
    this.tween.reset()
    //this.tween.destroy()
    if(this.counter == this.animatedLineStorage.length) {
      for(var i = 0; i < this.animatedLineStorage.length; i++) {
        this.tweenStorage[j].reset()
      }
      this.animate()
    }
  }

  setEmitterLinePosition(line, xRandomPos, yRandomPos) {
    line.x(( Math.abs(line.attrs.points[0] - xRandomPos)))
    line.y( -1 * Math.abs(line.attrs.points[1] - yRandomPos))
  }

}

export default Emit