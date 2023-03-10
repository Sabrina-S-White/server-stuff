const express = require('express')
const authenticate = require('../authenticate')
const Promotion = require('../models/promotion')
const promotionRouter = express.Router()
promotionRouter
  .route('/')
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.status = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions)
      })
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
      })
      .catch((err) => next(err))
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
  })
  .delete(authenticate.verifyUser, (req, res) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
      .catch((err) => next(err))
  })

promotionRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(promotion)
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not found`)
          err.status = 404
          return next(err)
        }
      })
      .catch((err) => next(err))
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    )
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      { _id: req.params.promotionId },
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
    Promotion.findByIdAndDelete(req.params.promotionId).then((response) => {
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json(response)
    })
    .catch((err) => next(err))
  })

module.exports = promotionRouter
