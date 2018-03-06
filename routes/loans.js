const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/* GET users listing. */

router.get('/', (req, res) => {
	res.send('respond with a resource');
});

router.get('/all', (req, res, next) => {
	Loans.findAll().then( (loans) => {
		req.params.loans = loans;
		req.params.books = [];
		req.params.patrons = [];
		loans.forEach((loan) => {
			Books.findById(loan.book_id).then((book) => {
				req.params.books.push(book)
			}).then(()=>{
				Patrons.findById(loan.patron_id).then((patron) => {
					req.params.patrons.push(patron);
				}).then(() => {
					console.log("ever hit this?");
					if((req.params.books.length === loans.length) && (req.params.patrons.length === loans.length)){
						next();
					}
				})
			});
		});
	});
}, (req, res)=> {
	console.log("get in here?");
	//res.send("hi?");
	res.render('loans/all_loans', { title: 'Loans | All', loans: req.params.loans, books: req.params.books, patrons: req.params.patrons } );
});

module.exports = router;
