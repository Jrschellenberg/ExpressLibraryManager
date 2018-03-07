const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


router.post('/create', (req, res, next) => {
	if(!req.body.title || !req.body.author || !req.body.genre){
		let err = new Error("Book Title, Author, and Genre are required!");
		err.status = 400;
		err.link = '/books/new';
		return next(err);
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
		let err = new Error("Book Title, Author, and Genre are required!");
		err.status = 400;
		err.link = '/books/details/'+req.params.id.toString();
		return next(err);
	}
	Books.findById(req.params.id).then((book) => {
		return book.update(req.body);
	}).then((book) => {
		res.redirect("/books/details/" + book.id);
	});
});

router.get('/new', (req, res) => {
	if(req.query.errorMessage && req.query.errorStatus && req.query.error ) {
		res.render('books/new_book', {title: 'Books | New', 	errorMessage : req.query.errorMessage, 
			errorStatus : req.query.errorStatus, error: req.query.error});
	}
	else{
		res.render('books/new_book', {title: 'Books | New'});
	}
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
	if(req.query.errorMessage && req.query.errorStatus && req.query.error ) {
		res.render('books/book_detail', { title: 'Books | Details | '+ req.params.book.title, book: req.params.book, loans: req.params.loans,
			errorMessage : req.query.errorMessage, errorStatus : req.query.errorStatus, error: req.query.error});
	}
	else{
		res.render('books/book_detail', { title: 'Books | Details | '+ req.params.book.title, book: req.params.book, loans: req.params.loans});
	}
});

module.exports = router;