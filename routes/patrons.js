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
		res.redirect("/books/details/" + patron.id);
	}).catch((err) => {
		res.render("error", {});
	});
});

router.get('/all', (req, res) => {
	Patrons.findAll().then((patrons) => {
		res.render('patrons/all_patrons', { title: 'Patrons', patrons: patrons });
		//res.send('test?!?!');
	});
});

router.get('/new', (req, res) => {
	res.render('patrons/new_patron', { title: 'Express' });
});

router.get("/details/:id", (req, res) => {
	Patrons.findById(req.params.id).then((patron) => {
		patron.getLoans().then((loans) => {
			loans[0].getTitle(Books).then((bookTitle) => {
				console.log(bookTitle);
			});
			
			//res.render('patrons/patron_details', {title: 'Patrons', patron: patron, loans: loans});
		});
	});
	res.send("herro");
});


module.exports = router;
