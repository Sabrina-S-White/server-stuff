const express = require('express')
const Partner = require('../models/partner')
const authenticate = require('../authenticate')
const partnerRouter = express.Router()

partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.status = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(partners)
      })
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(partner)
      })
      .catch((err) => next(err))
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`PUT operation not supported on /partners`)
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Partner.deleteMany()
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
      .catch((err) => next(err))
  })

partnerRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(partner)
        } else {
          err = new Error(`Partner ${req.params.partnerId} not found`)
          err.status = 404
          return next(err)
        }
      })
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(`POST operation not supported on /partners/${req.params.partnerId}`)
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndUpdate(
      { _id: req.params.partnerId },
      { $set: req.body },
      { new: true },
      function (err, result) {
        if (err) {
          res.send(err)
        } else {
          res.send(result)
        }
      }
    ).catch((err) => next(err))
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Partner.findByIdAndDelete(req.params.partnerId)
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
      .catch((err) => next(err))
  })

module.exports = partnerRouter
