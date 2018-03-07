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

router.post("/create", (req, res, next)=> {
	if(!req.body.first_name || !req.body.last_name || !req.body.address || !req.body.email || !req.body.library_id || !req.body.zip_code){
		return throwError(400, "All Fields are Required!", '/patrons/new', next);
	}
	Patrons.create(req.body).then((patron) => {
		res.redirect("/patrons/details/" + patron.id);
	}).catch((err) => {
		next(err);
	});
});

router.post('/update/:id', (req, res, next) => {
	if(!req.body.first_name || !req.body.last_name || !req.body.address || !req.body.email || !req.body.library_id || !req.body.zip_code){
		return throwError(400, "All Fields are Required!", '/patrons/details/'+req.params.id, next )
	}
	Patrons.findById(req.params.id).then((patron) => {
		return patron.update(req.body);
	}).then((patron) => {
		res.redirect("/patrons/details/" + patron.id);
	});
});

router.get('/all', (req, res) => {
	Patrons.findAll().then((patrons) => {
		res.render('patrons/all_patrons', { title: 'Patrons | All', patrons: patrons });
	});
});

router.get('/new', (req, res) => {
	return renderView('patrons/new_patron', {title: 'Patrons | New Patron'}, req, res);
});

router.get("/details/:id", (req, res, next) => {
	Patrons.findById(req.params.id).then((patron) => {
		req.params.patron = patron;
		patron.getLoans().then((loans) => {
			if(loans.length !== 0){
				req.params.loans = loans;
				let books = [];
				loans.forEach((loan) => {
					Books.findById(loan.dataValues.book_id).then((book) => {
						books.push(book.title);
					}).then(() => {
						if(books.length === loans.length){
							req.params.books = books;
							next();
						}
					});
				});
			}
			else{
				req.params.loans = '';
				req.params.books = '';
				next();
			}
		});
	}).catch((err) => {
		console.log(err);
	});
}, (req, res)=> {
	return renderView('patrons/patron_details',  {title: 'Patrons | Details',	patron: req.params.patron, 
		loans: req.params.loans,	books: req.params.books}, req, res);
});

module.exports = router;