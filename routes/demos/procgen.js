var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next) {
  res.render('procgen');
});


router.get('/dungeons/basic', function(req, res, next){
  res.render('pg_dungeon_basic');
});


router.get('/language/ngrams', function(req, res, next){
  res.render('pg_ngram');
});


router.get('/terrain/basic', function(req, res, next){
  res.render('pg_terrain_basic');
});

router.get('/terrain/clouds', function(req, res, next){
  res.render('pg_terrain_clouds');
});

router.get('/terrain/minmax', function(req, res, next){
  res.render('pg_terrain_minmax');
});


router.get('/images/l-systems', function(req, res, next){
  res.render('pg_images_l_systems');
});


module.exports = router;