const express = require('express')
const app = express()
const http = require('http').Server(app)
const socket = require('socket.io')
const io = socket(http)
const ip = require('ip').address();
const {v4} = require('uuid')


app.use('/style', express.static('/client/styles'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

let users = [

]

let messages = [

]



io.on('connection', (socket) => {
  let userId = socket.id;
  console.log(`${userId}connect`)
  socket.on('disconnect', () => {
    let idx = users.findIndex(user => user.id == userId)
    io.emit('test', users[idx])
    users = users.filter(user => user.id != userId)
    io.emit('users', users)
    
  })

  socket.on('user', username => {
    let user = {
      id: userId,
      name: username
    }
    users.push(user)
    io.emit('users', users)
    io.emit('messages', messages)
  })


  socket.on('message', msgForm => {
    message = {
      id: v4(),
      text: msgForm.text,
      username: msgForm.user
    }
    messages.push(message)
    io.emit('messages', messages)
  }) 
})
let port = process.env.port || 8085
http.listen(port, () => {
  console.log(`http://${ip}:${port}`)
})