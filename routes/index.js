var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next){
	res.render('about');
});

router.get('/add', function(req, res, next){
	res.render('add');
});

router.get('/search', function(req, res, next){
	res.render('search');
});

router.get('/api', function(req, res, next){
	res.render('api');
});

router.get('/contact', function(req, res, next){
	res.render('contact');
});

router.get('/demand', function(req, res, next){
	res.render('demand');
});

router.get('/searchdemand', function(req, res, next){
	res.render('searchdemand');
});

module.exports = router;
