const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post("/create", (req, res)=> {
	Patrons.create(req.body).then((patron) => {
		res.redirect("/patrons/details/" + patron.id);
	}).catch((err) => {
		res.render("error", {});
	});
});

router.post('/update/:id', (req, res) => {
	Patrons.findById(req.params.id).then((patron) => {
		return patron.update(req.body);
	}).then((patron) => {
		res.redirect("/patrons/details/" + patron.id);
	});
});

router.get('/all', (req, res) => {
	Patrons.findAll().then((patrons) => {
		res.render('patrons/all_patrons', { title: 'Patrons | All', patrons: patrons });
		//res.send('test?!?!');
	});
});

router.get('/new', (req, res) => {
	res.render('patrons/new_patron', { title: 'Patrons | New Patron' });
});

router.get("/details/:id", (req, res, next) => {
	Patrons.findById(req.params.id).then((patron) => {
		req.params.patron = patron;
		patron.getLoans().then((loans) => {
			console.log(loans);
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
	//res.send("WTF");
	res.render('patrons/patron_details', {title: 'Patrons | Details', patron: req.params.patron, loans: req.params.loans, books: req.params.books});
});

module.exports = router;