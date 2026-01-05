// models/Patron.js

module.exports = (sequelize, DataTypes) => {
  const Patron = sequelize.define('Patron', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'First name is required.' } }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Last name is required.' } }
    },
    address: { 
      type: DataTypes.STRING, 
      // allowNull: false, 
      // validate: { notEmpty: { msg: 'Address is required.' } } 
    }, 
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      validate: { notEmpty: { msg: 'Email is required.' }, 
      isEmail: { msg: 'Email must be valid.' } } 
    }, 
    library_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notEmpty: { msg: 'Library ID must be a number.' } }
    }, 
    zip_code: { 
      type: DataTypes.INTEGER, 
      // allowNull: false, 
      // validate: { notEmpty: { msg: 'Zip code is required.' } } 
    } 
  }, { 
    timestamps: false 
  }); 
  return Patron; 
};