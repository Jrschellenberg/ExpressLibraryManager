const toDate = function (dateStr){
	return Date.parse(dateStr);
};

module.exports.toDate = toDate;

const throwError = function (status, message, link, next){
	let err = new Error(message);
	err.status = status;
	err.link = link;
	return next(err);
};

module.exports.throwError = throwError;

const renderView = function(view, obj, req, res){
	if (req.query.errorMessage && req.query.errorStatus && req.query.error) {
		obj.errorMessage = req.query.errorMessage;
		obj.errorStatus = req.query.errorStatus;
		obj.error = req.query.error;
	}
	return res.render(view, obj);
};

module.exports.renderView = renderView;