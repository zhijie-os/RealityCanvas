const express = require('express')
const http = require('http')
const path = require('path')
const app = express()
const server = http.Server(app)

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'))
})

server.listen(3000, () => {
  console.log('listening on 3000')
})