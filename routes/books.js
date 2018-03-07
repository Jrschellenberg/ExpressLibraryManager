const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post('/create', (req, res) => {
	Books.create(req.body).then((book) => {
		res.redirect("/books/details/" + book.id);
	}).catch((err) => {
		res.render("error", {});
	});
});

router.post('/update/:id', (req, res) => {
	Books.findById(req.params.id).then((book) => {
		return book.update(req.body);
	}).then((book) => {
		res.redirect("/books/details/" + book.id);
	});
});

router.get('/new', (req, res) => {
	res.render('books/new_book', { title: 'Books | New' });
});

router.get('/find/:filter', (req, res, next) => {
	if(req.params.filter.toLowerCase() === 'overdue'){
		Loans.findAll({
			where: {
				return_by: {
					[Op.lte]: dateFormat(this.createdAt, "yyyy-mm-dd")
				},
				returned_on: null
			}
		}).then((loans) => {
			findBooks(loans,req, next);
		}).catch((err) => {
			next(err);
		});
	}
	else if(req.params.filter.toLowerCase() === 'checked_out'){
		Loans.findAll({
			where: {
				returned_on: null
			}
		}).then((loans) => {
			findBooks(loans,req, next);
		}).catch((err) => {
			next(err);
		});
	}
	else{
		Books.findAll().then((books) => {
			res.render('books/all_books', { title: 'Books | All', books: books });
		});
	}
	function findBooks(loans, req, next){
		let books = [];
		loans.forEach((loan) => {
			Books.findById(loan.book_id).then((book) => {
				books.push(book);
			}).then(() => {
				console.log("hitting this?");
				if(books.length === loans.length){
					req.params.books = books;
					next();
				}
			});
		});
	}
}, (req, res)=> {
	res.render('books/all_books', { title: 'Books | Overdue', books: req.params.books });
});

router.get('/return_book/:bookId/:patronName', (req, res) => {
	Books.findById(req.params.bookId).then((book) => {
		book.getLoans().then((loan) => {
			let date = dateFormat(this.createdAt, "yyyy-mm-dd");
			res.render('books/return_book', { title: 'Books | Return '+book.title, book: book, date: date,
				name: req.params.patronName, loan: loan[0] });
		});
	});
});

//May have to come back to this. Only grabbing history for 1 patron atm..
router.get('/details/:id', (req, res) => {
	Books.findById(req.params.id).then((book) => {
		book.getLoans().then((loans) => {
			Patrons.findById(loans[0].dataValues.patron_id).then((patron) => {
				if(patron){ //Error handling for no patron name.
					return patron.first_name + ' ' + patron.last_name;
				}
				return '';
				}).then((patronName) => {
				res.render('books/book_detail', { title: 'Books | Details | '+ book.title, book: book, loans: loans, name: patronName});
			});
		}).catch(() => {
			let loans = '';
			let patronName = '';
			res.render('books/book_detail', { title: 'Books | Details | '+ book.title, book: book, loans: loans, name: patronName});
		});
	});
});

module.exports = router;