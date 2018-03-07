const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const toDate = require('./utils').toDate;
const throwError = require('./utils').throwError;
const renderView = require('./utils').renderView;

/*
POST ROUTES
 */

router.post('/create', (req, res, next) => {
	if(!req.body.title || !req.body.author || !req.body.genre){
		return throwError(400, "Book Title, Author, and Genre are required!", "/books/new", next);
	}
	Books.create(req.body).then((book) => {
		res.redirect("/books/details/" + book.id);
	}).catch((err) => {
		err.link = '/books/new';
		return next(err);
	});
});

router.post('/update/:id', (req, res, next) => {
	if(!req.body.title || !req.body.author || !req.body.genre){
		return throwError(400, "Book Title, Author, and Genre are required!", '/books/details/'+req.params.id.toString(), next);
	}
	Books.findById(req.params.id).then((book) => {
		return book.update(req.body);
	}).then((book) => {
		res.redirect("/books/details/" + book.id);
	});
});

/*
GET ROUTES
 */

router.get('/new', (req, res) => {
	return renderView("books/new_book", {title: 'Books | New'}, req, res);
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

router.get('/return_book/:bookId/:patronName', (req, res, next) => {
	Books.findById(req.params.bookId).then((book) => {
		book.getLoans({
			where: {
				returned_on : null
			}
		}).then((loan) => {
			req.params.book = book;
			req.params.date = dateFormat(this.createdAt, "yyyy-mm-dd");
			req.params.loan = loan[0];
			next();
		});
	});
}, (req, res) => {
	return renderView('books/return_book', { title: 'Books | Return '+req.params.book.title, book: req.params.book, date: req.params.date,
		name: req.params.patronName, loan: req.params.loan}, req, res);
});

router.get('/details/:id', (req, res, next) => {
	Books.findById(req.params.id).then((book) => {
		req.params.book = book;
		book.getLoans().then((loans) => {
			if(loans.length !== 0){
				let patronIndex = 0;
				loans.forEach((loan) => {
					Patrons.findById(loan.dataValues.patron_id).then((patron) => {
						loan.patron_name = patron.first_name + " " + patron.last_name;
						patronIndex++;
					}).then(() => {
						if(patronIndex === loans.length){
							req.params.loans = loans;
							next();
						}
					});
				});
			}
			else{
				req.params.loans = '';
				next();
			}
		});
	}).catch((err) => {
		next(err);
	});
}, (req, res) => {
	return renderView('books/book_detail', { title: 'Books | Details | '+ req.params.book.title, book: req.params.book, loans: req.params.loans}, req, res);
});

module.exports = router;