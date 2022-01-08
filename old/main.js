let isTest = false

navigator.getUserMedia({ audio: false, video: { width: 1280, height: 720 } },
    function(stream) {
      var video = document.querySelector('video')
      video.srcObject = stream
      video.onloadedmetadata = function(e) {
      video.play()
    }
  },
  function(err) {
    console.log("The following error occured: " + err.name)
  }
)

const resultDiv = document.querySelector('#result-div')
let finalTranscript = ''

window.SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition
recognition = new webkitSpeechRecognition()
recognition.lang = 'en-US'
recognition.interimResults = true
recognition.continuous = true

function test() {
  let transcript = 'hello world snap'
  let html = getHTML(transcript)
  resultDiv.innerHTML = html
}

recognition.onresult = (event) => {
  for (let i = event.resultIndex; i < event.results.length; i++) {
    let transcript = event.results[i][0].transcript
    if (event.results[i].isFinal) {
      finalTranscript += transcript
      interimTranscript = ''
    } else {
      interimTranscript = transcript
    }
    let html = getHTML(finalTranscript)
    html += '<i style="color:#777;">' + interimTranscript + '</i>'
    resultDiv.innerHTML = html
  }
}

if (isTest) {
  test()
} else{
  recognition.start()
}

function getHTML(transcript) {
  let html = ''
  let words = transcript.split(' ')
  for (let j = 0; j < words.length; j++) {
    let word = words[j]
    html += `<i class="draggable" \
                id="word-${j}-${word}"\
                draggable="true" \
                ondragstart="onDragStart(event)" \
                >` + word + '</i>' + ' '
  }
  return html
}

function onDragOver(event) {
  event.preventDefault()
}

function onDragStart(event) {
  let id = event.target.id
  event.dataTransfer.setData('text/plain', id)
  if (!id.includes('dragged-')) {
    event.currentTarget.style.backgroundColor = 'yellow'
  }
}

function onDrop(event) {
  console.log('on drop')
  console.log(event)
  const id = event.dataTransfer.getData('text')
  console.log(id)
  const draggableElement = document.getElementById(id)
  let copy = draggableElement
  if (!id.includes('dragged-')) {
    copy = document.createElement('div')
    copy.className = 'dragged'
    copy.draggable = 'true'
    copy.id = 'dragged-' + id
    copy.setAttribute('ondragstart', 'onDragStart(event)')
    copy.innerHTML = draggableElement.innerHTML
    const dropzone = event.target
    dropzone.appendChild(copy)
    searchImage(id)
  }
  copy.style.left = (event.clientX) + 'px'
  copy.style.top = (event.clientY) + 'px'
  event.dataTransfer.clearData()
}

function searchImage(id) {
  let keyword = id.split('-')[2]
  console.log(keyword)
  let key = 'AIzaSyDu8Ji5rhS8BoQi6-VVF-YmxpPPgZqaAkU'
  let cx = 'e0827523dbf94d1cc'
  let url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${keyword}&searchType=image`
  $.getJSON(url, (data) => {
    let src = data.items[0].image.thumbnailLink
    addImage(id, src)
  })

}

function sesarchImageTest(id) {
  let url = 'https://www.googleapis.com/customsearch/v1?key=AIzaSyDu8Ji5rhS8BoQi6-VVF-YmxpPPgZqaAkU&cx=e0827523dbf94d1cc&q=snap&searchType=image'
  addImage(id, src)
}

function addImage(id, src) {
  const el = document.getElementById(`dragged-${id}`)
  let image = document.createElement('img')
  image.src = src
  el.appendChild(document.createElement('br'))
  el.appendChild(image)
}

