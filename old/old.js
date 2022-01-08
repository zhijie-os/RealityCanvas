
    /*
    const editorDom = svgcanvasRef.current
    const canvas = new SvgCanvas(editorDom, config)
    window.SvgCanvas = SvgCanvas
    window.canvas = canvas
    window.editorDom = editorDom
    window.config = config

    updateCanvas(canvas, editorDom, config, true)
    dispatchCanvasState({ type: 'init', canvas, svgcanvas: editorDom, config })

    $('#svgroot').attr('width', 1000)
    $('#svgroot').attr('height', 1000)
    $('#svgroot').attr('x', 0)
    $('#svgroot').attr('y', 0)
    $('#canvasBackground').attr('x', 0)
    $('#canvasBackground').attr('y', 0)
    $('#svgcontent').attr('x', 0)
    $('#svgcontent').attr('y', 0)

    setMode('fhpath')

    // debug()

    let count = 0
    editorDom.addEventListener('mouseup', () => {
      if (canvas.eventContext.getCurrentMode() === 'select') {
        setMode('fhpath')
        return
      }

      console.log(canvas.eventContext.getCurrentMode())
      // console.log(count)

      let id = canvas.eventContext.getId()
      let el = document.getElementById(id)
      // console.log(el)
      window.el = el

      let bbox = canvas.getBBox(el)
      let cx = bbox.x + bbox.width/2
      let cy = bbox.y + bbox.height/2
      let cw = bbox.width
      let ch = bbox.height
      // console.log(cx, cy)
      // return
      let d = el.getAttribute('d')
      window.parseSVG = parseSVG
      let path = parseSVG(d)
      // console.log(path)
      window.path = path
      let l = path.map(p => [p.x, p.y])

      let d1 = 'M280,250A200,200,0,1,1,680,250A200,200,0,1,1,280,250Z'
      if (count%2 !== 0) {
        d1 = 'M480,437l-29-26.4c-103-93.4-171-155-171-230.6c0-61.6,48.4-110,110-110c34.8,0,68.2,16.2,90,41.8 C501.8,86.2,535.2,70,570,70c61.6,0,110,48.4,110,110c0,75.6-68,137.2-171,230.8L480,437z'
      }
      window.d1

      el.parentNode.removeChild(el)

      // let temp = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      // temp.setAttribute('d', d1)
      let bb = svgPathBbox(d1)
      window.bb = bb
      let tx = (bb[0] + bb[2])/2
      let ty = (bb[1] + bb[3])/2
      let tw = bb[2] - bb[0]
      let th = bb[3] - bb[1]

      let a
      a = pathParse(d1).relNormalize({ transform: `scale(${(1/tw)*cw} ${(1/th)*ch})` })
      d1 = serializePath(a)

      bb = svgPathBbox(d1)
      tx = (bb[0] + bb[2])/2
      ty = (bb[1] + bb[3])/2
      tw = bb[2] - bb[0]
      th = bb[3] - bb[1]

      let ncx = -tx+cx
      let ncy = -ty+cy
      a = pathParse(d1).absNormalize({ transform: `translate(${-tx+cx} ${-ty+cy})`})
      d1 = serializePath(a)
      // console.log(svgPathBbox(d1))

      let prev
      pasition.animate({
        from: d,
        to: d1,
        time: 1000,
        // easing : function(){ },
        // begin:function(shapes){ },
        progress : function(shapes, percent){
          if (prev) {
            prev.parentNode.removeChild(prev)
          }

          let svg = document.querySelector('#svgcontent')
          let g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
          g.setAttribute('id', `svg_${num}`)
          for (let curves of shapes) {
            for (let curve of curves) {
              let d = `M${curve[0]},${curve[1]} C${curve[2]},${curve[3]} ${curve[4]},${curve[5]} ${curve[6]},${curve[7]}`
              let path = renderCurve(d)
              g.appendChild(path)
            }
          }
          // g.setAttribute('transform', `translate(${-(tx - cx)} ${-(ty - cy)})`)
          svg.appendChild(g)
          prev = g
        },
        end : function(shapes){
          console.log('end')
          count++
          addBody(d1, ncx, ncy)
        }
      })

    })


  const renderCurve = (d) => {
    let svg = document.querySelector('#svgcontent')
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', '#000')
    path.setAttribute('stroke-width', '5')
    path.setAttribute('d', d)
    return path
  }

  const debug = () => {
    setInterval(() => {
      if (engine.world.bodies.length === 0) return
      let body = engine.world.bodies[0]
      console.log(body.position, body.angle)
    }, 100)
  }

  const setMode = (newMode) => {
    dispatchCanvasState({ type: 'mode', mode: newMode })
  }

    */
