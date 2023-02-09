var express = require('express');
var router  = express.Router();

var strumRouter = require('./demos/strums');
router.use('/strums', strumRouter);

var procGen = require('./demos/procgen');
router.use('/procgen', procGen);

router.get('/emulator', function(req, res, next) {
  res.render('beebc');
});

router.get('/physics', function(req, res, next) {
  res.render('physics');
});

router.get('/traffic', function(req, res, next) {
  res.render('traffic');
});

router.get('/tribes', function(req, res, next) {
  res.render('tribes');
});

router.get('/saltcalc', function(req, res, next) {
  res.render('saltcalc');
});

module.exports = router;