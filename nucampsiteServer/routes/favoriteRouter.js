const express = require('express')
const authenticate = require('../authenticate')
const Favorite = require('../models/favorite')
const cors = require('./cors')
const favoriteRouter = express.Router()

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then((campsite) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(campsite)
      })
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          req.body.forEach((fav) => {
            if (!favorite.campsite.includes(fav._id)) {
              favorite.campsite.push(fav._id)
            }
          })
          favorite
            .save()
            .then((saved) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(saved)
            })
            .catch((err) => next(err))
        } else {
          Favorite.create({
            user: req.user._id,
          })
            .then((fav) => {
              req.body.forEach((fav) => {
                if (!favorite.campsite.includes(fav._id)) {
                  favorite.campsite.push(fav._id)
                }
              })
              fav
                .save()
                .then((saved) => {
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.json(saved)
                })
                .catch((err) => next(err))
            })
            .catch((err) => next(err))
        }
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    res.end('This operation is not supported.')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id })
      .then((response) => {
        if (response) {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(response)
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('You do not have any favorites to delete.')
        }
      })
      .catch((err) => next(err))
  })

favoriteRouter
  .route('./:campsiteId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    res.end('This operation is not supported.')
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId)
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(favorite)
              })
              .catch((err) => next(err))
          } else {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('That campsite is already a favorite!')
          }
        } else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorite)
            })
            .catch((err) => next(err))
        }
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    res.end('This operation is not supported.')
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        if (favorite) {
          if (favorite.campsites.indexOf(req.params.campsiteId) >= 0) {
            favorite.campsites.splice(
              favorite.campsites.indexOf(req.params.campsiteId),
              1
            )
          }
          favorite
            .save()
            .then((favorite) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favorite)
            })
            .catch((err) => next(err))
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('There are no favorites to delete.')
        }
      })
      .catch((err) => next(err))
  })

module.exports = favoriteRouter
