const express = require('express')
const User = require('../models/user')
const usersRouter = express.Router()
const passport = require('passport')
const cors = require('./cors')
const authenticate = require('../authenticate')

usersRouter
  .route('/')
  .get(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    function (req, res, next) {
      User.find()
        .then((users) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(users)
        })
        .catch((err) => next(err))
    }
  )

usersRouter
  .route('/facebook/token')
  .get(passport.authenticate('facebook-token'), (req, res) => {
    if (req.user) {
      const token = authenticate.getToken({ _id: req.user._id })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({
        success: true,
        token: token,
        status: 'You are successfully logged in!',
      })
    }
  })

usersRouter.route('/signup').post(cors.corsWithOptions, (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({ err: err })
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname
        }
        user.save((err) => {
          if (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.json({ err: err })
            return
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({ success: true, status: 'Registration Successful!' })
          })
        })
      }
    }
  )
})

usersRouter
  .route('/login')
  .post(cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id })
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.json({
      success: true,
      token: token,
      status: 'You are successfully logged in!',
    })
  })

usersRouter.route('/logout').get(cors.corsWithOptions, (req, res, next) => {
  if (req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  } else {
    const err = new Error('You are not logged in!')
    err.status = 401
    return next(err)
  }
})

module.exports = usersRouter
