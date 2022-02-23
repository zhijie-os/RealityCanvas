class Morph {
  constructor() {
    this.canvas = window.Canvas
    this.tween = null
    this.animatedLineStorage = null
    this.tweenStorage = []
    this.counter = 0
    this.animate = this.animate.bind(this)
    this.replayAnimation = this.replayAnimation.bind(this)
  }

  animate() {
    this.animatedLineStorage = this.canvas.stage.find('.lineToAnimate')
    let canvas = this.canvas
    for(var i = 0; i < this.animatedLineStorage.length; i++) {
      this.tween = new Konva.Tween({
        node: this.animatedLineStorage[i],
        duration: 1,
        easing: Konva.Easings.EaseInOut,
        onUpdate: function() {
        },
        onFinish: function() {
          if(canvas.normalAnimation === true) {
            let randomIndex = canvas.generateRandomIndex()
            let xRandomPos = canvas.emitterLinePointsCopy[randomIndex]
            let yRandomPos = canvas.emitterLinePointsCopy[randomIndex - 1]
            console.log(canvas.emitterLinePointsCopy)

            this.tween.reset()
            let updatedPoints = this.node.points()
            //updatedPoints[0] = xRandomPos
            console.log(xRandomPos)
            console.log(yRandomPos)
            //updatedPoints[1] = yRandomPos
            //this.node.points(updatedPoints)
            this.node.x(( xRandomPos - this.node.attrs.points[0] ))
            this.node.y( -1.5* (yRandomPos - this.node.attrs.points[1]))
            this.tween.play()
          }
        },
        // set new values for any attributes of a passed node
        y: (( canvas.verticalEmitter === true ? canvas.stage.height()  : 0)),
        x: (( canvas.horizontalEmitter === true ? canvas.stage.width() : 0)),
        fill: 'red'
      })
      this.tweenStorage.push(this.tween)
    }

    for(var j = 0; j < this.tweenStorage.length; j++) {
//       this.tweenStorage[j].reset()
      this.tweenStorage[j].play()
    }
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

export default Morph