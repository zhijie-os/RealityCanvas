
class ContextMenu {
  constructor() {
    this.stage = Canvas.stage
    this.layer = Canvas.layer
    this.physics = Canvas.physics

    this.currentShape = null
    this.init()
  }

  init() {
    this.menuNode = document.getElementById('menu')

    let massButton = document.getElementById('mass-button')
    massButton.addEventListener('click', () => {
      console.log('mass')
      this.physics.addBody(this.currentShape)
      this.menuNode.style.display = 'none'
    })

    let staticButton = document.getElementById('static-button')
    staticButton.addEventListener('click', () => {
      console.log('static')
      this.physics.addBody(this.currentShape, { isStatic: true })
      this.menuNode.style.display = 'none'
    })
  }

  show(e) {
    if (e.target === this.stage) return
    e.evt.preventDefault()
    this.currentShape = e.target
    this.menuNode.style.display = 'initial'
    let containerRect = this.stage.container().getBoundingClientRect()
    this.menuNode.style.top = containerRect.top + this.stage.getPointerPosition().y + 4 + 'px'
    this.menuNode.style.left = containerRect.left + this.stage.getPointerPosition().x + 4 + 'px'
  }

}

export default ContextMenu