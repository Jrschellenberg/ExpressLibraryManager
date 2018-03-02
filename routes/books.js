var express = require('express');
var router = express.Router();
const Books = require("../models").Books;

console.log(Books);

/* GET users listing. */

router.get('/', function(req, res) {
	res.render('test', { title: 'Express' });
});

router.get('/new', function(req, res) {
	//res.send("WTF?");
	res.render('new_book', { title: 'Express' });
});

router.get('/all', function(req, res) {
	//res.send("wtf?");
	Books.findAll().then((books) => {
		res.render('all_books', { title: 'Express', books: books });
	});
});



module.exports = router;
