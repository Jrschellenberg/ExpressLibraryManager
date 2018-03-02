var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {
	res.render('test', { title: 'Express' });
});

router.get('/books/new', function(req, res, next) {
	res.render('new_books', { title: 'Express' });
});

router.get('/all_books', function(req, res, next) {
	res.render('all_books', { title: 'Express' });
});


module.exports = router;
