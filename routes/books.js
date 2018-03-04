var express = require('express');
var router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;

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

router.get('/:id', function(req, res) {
	Books.findById(req.params.id).then((book) => {
		book.getLoans().then((loans) => {
			console.log(loans);
			Patrons.findById(loans[0].dataValues.patron_id).then((patron) => {
				//console.log(patron.first_name);
				if(patron){ //Error handling for no patron name.
					return patron.first_name + ' ' + patron.last_name;
				}
				return '';
				}).then((patronName) => {
				res.render('book_detail', { title: book.title, book: book, loans: loans, name: patronName});
			});
		}).catch(() => {
			let loans = '';
			let patronName = '';
			res.render('book_detail', { title: book.title, book: book, loans: loans, name: patronName});
		});
	});
});



module.exports = router;
