'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    id: {
	    type: DataTypes.INTEGER,
	    primaryKey: true,
	    autoIncrement:true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
  });
  Loans.associate = function(models) {
    Loans.belongsTo(models.Patrons);
    Loans.belongsTo(models.Books);
    // associations can be defined here
  };
  return Loans;
};