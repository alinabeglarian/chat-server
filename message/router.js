const { Router } = require('express')
const Sse = require('json-sse')
const Message = require('./model')

const router = new Router()

Message
  .findAll()
  .then(messages => {
    const json = JSON.stringify(messages)
    const stream = new Sse(json)
    
    router.get('/stream', (req, res) => {
      stream.init(req, res)
    })

    router.post('/message', (req, res, next) => {
      Message
        .create(req.body)
        .then(message => {
          Message
            .findAll()
            .then(messages => {

              const json = JSON.stringify(messages)
              stream.updateInit(json)
              stream.send(json)
              return res.status(201).send(message)
            })
        })
      .catch(error => next(error))
    })
  })


module.exports = router