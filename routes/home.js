var express = require('express');
var router = express.Router();
//var path = require("path");
//var Article = require("../models").Article;


router.get('/', function(req, res, next) {
	//res.sendFile(path.join(__dirname+'/views/home.html'));
	res.send("Hello World!");
	
});

module.exports = router;