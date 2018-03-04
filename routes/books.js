const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const dateFormat = require('dateformat');


/* GET users listing. */

router.get('/', (req, res) => {
	res.render('test', { title: 'Express' });
});

router.get('/new', (req, res) => {
	res.render('new_book', { title: 'Express' });
});

router.get('/all', (req, res) => {
	Books.findAll().then((books) => {
		res.render('all_books', { title: 'Express', books: books });
	});
});

router.get('/return_book/:bookId/:patronName', (req, res) => {
	Books.findById(req.params.bookId).then((book) => {
		book.getLoans().then((loan) => {
			let now = new Date();
			let date = dateFormat(now, "yyyy-mm-dd");
			res.render('return_book', { title: 'Return '+book.title, book: book, date: date,
				name: req.params.patronName, loan: loan[0] });
		});
	});
});

//May have to come back to this. Only grabbing history for 1 patron atm..
router.get('/:id', (req, res) => {
	Books.findById(req.params.id).then((book) => {
		book.getLoans().then((loans) => {
			Patrons.findById(loans[0].dataValues.patron_id).then((patron) => {
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