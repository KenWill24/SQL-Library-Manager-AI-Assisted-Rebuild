const { Sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty.'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author cannot be empty.'
        }
      }
    },
    genre: {
      type: DataTypes.STRING
    },
    first_published: {
      type: DataTypes.INTEGER
    }
  }, {
    // This disables createdAt/updatedAt
    timestamps: false   
  });

  return Book;
};