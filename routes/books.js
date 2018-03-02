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
	//res.send("wtf?");
	Books.findById(req.params.id).then((book) => {
		//let loan = book.getLoans;
		// res.render('book_detail', { title: book.title, book: book, loan: loan });
		res.render('book_detail', { title: book.title, book: book});
		
		
		// book.getLoan().then((loan) => {
		// 	loan.getPatron().then((patron) => {
		//		
		//		
		// 	})
		// 	// loans.forEach((loan, index, array1 )=>{
		// 	// 	Patrons.findById(loan.patron_id).then((patron) => {
		// 	// 		loans[index].patron_id = patron.first_name + " " +patron.last_name;
		// 	// 	});
		//
		// 	// });
		//	
		// });
	});
});



module.exports = router;
