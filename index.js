const express = require('express')
const Sse = require('json-sse')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./db')

// initialize the server
const app = express()

// register middleware

// allow cross-origin resource sharing
app.use(cors())

// read request json bodies
const jsonParser = bodyParser.json() 
app.use(jsonParser)

// our data store - basically the database for now
const messages = [
  'hello ',
  'can you see this?'
]

// serialize the data
const json = JSON.stringify(messages)
// initialize the event source
const stream = new Sse(json)

function onStream(req, res) {
  stream.init(req, res)
}

// listen for new clients
app.get('/stream', onStream)

// listen for new messages
function onMessage(req, res) {
  // desctucture the users message
  const { message } = req.body 

  // add it to the store
  messages.push(message)

  // reserialize the store
  const json = JSON.stringify(messages)

  // update initial data
  stream.updateInit(json)

  // notify all the clients
  stream.send(json)

  // send a response
  return res.status(201).send(message)
}

app.post('/message', onMessage)

// start the server on the right port
const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Listening on: ${port}`))