var express = require('express');
var router  = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'William Power' });
});

router.get('cubebot', function(req, res, next) {
  res.render('cubebot');
});

module.exports = router;
