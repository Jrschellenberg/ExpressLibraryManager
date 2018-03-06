const express = require('express');
const router = express.Router();
const Books = require("../models").Books;
const Patrons = require("../models").Patrons;
const Loans = require("../models").Loans;
const dateFormat = require('dateformat');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

router.post('/create', (req, res) => {
	Loans.create(req.body).then(() => {
		res.redirect("/loans/all");
	}).catch((err) => {
		res.render("error", {});
	});
});

router.get('/', (req, res) => {
	res.send('respond with a resource');
});

router.get('/all', (req, res, next) => {
	Loans.findAll().then( (loans) => {
		let indexBooks = 0;
		let indexPatrons = 0;
		loans.forEach((loan) => {
			Books.findById(loan.book_id).then((book) => {
				loan.book_title = book.title;
				indexBooks++;
			}).then(()=>{
				Patrons.findById(loan.patron_id).then((patron) => {
					loan.patron_name = patron.first_name + ' ' + patron.last_name;
					indexPatrons++;
				}).then(() => {
					if((indexBooks === loans.length) && (indexPatrons === loans.length)){
						req.params.loans = loans;
						next();
					}
				});
			});
		});
	}).catch((err) => {
		console.log(err);
	});
}, (req, res)=> {
	if(!res.headersSent){
		res.render('loans/all_loans', { title: 'Loans | All', loans: req.params.loans } );
	}
});

router.get('/overdue', (req, res, next) => {
	Loans.findAll({
		where: {
			return_by: {
				[Op.lte]: dateFormat(this.createdAt, "yyyy-mm-dd")
			},
			returned_on: null
		}
	}).then( (loans) => {
		let indexBooks = 0;
		let indexPatrons = 0;
		loans.forEach((loan) => {
			Books.findById(loan.book_id).then((book) => {
				loan.book_title = book.title;
				indexBooks++;
			}).then(()=>{
				Patrons.findById(loan.patron_id).then((patron) => {
					loan.patron_name = patron.first_name + ' ' + patron.last_name;
					indexPatrons++;
				}).then(() => {
					if((indexBooks === loans.length) && (indexPatrons === loans.length)){
						req.params.loans = loans;
						next();
					}
				});
			});
		});
	}).catch((err) => {
		console.log(err);
	});
}, (req, res)=> {
	if(!res.headersSent){
		res.render('loans/all_loans', { title: 'Loans | All', loans: req.params.loans } );
	}
});

router.get('/checked_out', (req, res, next) => {
	Loans.findAll({
		where: {
			returned_on: null
		}
	}).then( (loans) => {
		let indexBooks = 0;
		let indexPatrons = 0;
		loans.forEach((loan) => {
			Books.findById(loan.book_id).then((book) => {
				loan.book_title = book.title;
				indexBooks++;
			}).then(()=>{
				Patrons.findById(loan.patron_id).then((patron) => {
					loan.patron_name = patron.first_name + ' ' + patron.last_name;
					indexPatrons++;
				}).then(() => {
					if((indexBooks === loans.length) && (indexPatrons === loans.length)){
						req.params.loans = loans;
						next();
					}
				});
			});
		});
	}).catch((err) => {
		console.log(err);
	});
}, (req, res)=> {
	if(!res.headersSent){
		res.render('loans/all_loans', { title: 'Loans | All', loans: req.params.loans } );
	}
});


router.get('/new', (req, res, next) => {
	Books.findAll().then((books) => {
		req.params.books = books;
		Patrons.findAll().then((patrons) => {
			req.params.patrons = patrons;
			let now = Date.now();
			req.params.loaned_on = dateFormat(now, "yyyy-mm-dd");
			req.params.return_by = dateFormat(now+(1000*60*60*24*7), "yyyy-mm-dd"); //(1000*60*60*24*4) is 4 days in milliseconds
		}).then(() => {
			next();
		})
	});
}, (req, res)=> {
	if(!res.headersSent){
		res.render('loans/new_loan', { title: 'Loans | New', books: req.params.books, patrons: req.params.patrons, loanedOn: req.params.loaned_on, returnBy: req.params.return_by });
	}
});


module.exports = router;
