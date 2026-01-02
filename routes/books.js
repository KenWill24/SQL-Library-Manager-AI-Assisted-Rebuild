// Creating data
const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Book } = require('../models');

// -----------------------------------------------------
// GET /books — Show all books
// -----------------------------------------------------
router.get("/", async (req, res, next) => {
  try {
    // items per page
    const limit = 10; 
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    // Build search filter (case-insensitive, partial match)
    const searchFilter = search
      ? {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { author: { [Op.like]: `%${search}%` } },
            { genre: { [Op.like]: `%${search}%` } },
            { first_published: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    // Count total results
    const totalBooks = await Book.count({ where: searchFilter });

    // Fetch paginated results
    const books = await Book.findAll({
      where: searchFilter,
      limit,
      offset: (page - 1) * limit,
      order: [["title", "ASC"]],
    });

    const totalPages = Math.ceil(totalBooks / limit);

    res.render("all_books", {
      books,
      search,
      page,
      totalPages,
      noResults: books.length === 0,
    });
  } catch (error) {
    next(error);
  }
});


// -----------------------------------------------------
// GET /books/new — Show new book form
// -----------------------------------------------------
router.get('/new', (req, res) => {
  res.render('new_book', { title: 'New Book', book: {} });
});

// -----------------------------------------------------
// POST /books/new — Create a new book
// -----------------------------------------------------
router.post('/new', async (req, res, next) => {
  try {
    await Book.create(req.body);

    //Redirect to last page so the new book is visible
    const totalBooks = await Book.count();
    const lastPage = Math.ceil(totalBooks / 10);

    res.redirect(`/books?page=${lastPage}`);

  } catch (err) {
    // Added for debugging
    console.error("Book creation error:", err);

    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      // Re-render form with validation messages
      res.render('new_book', { 
        title: 'New Book', 
        book: req.body, 
        errors: err.errors 
      });
    } else {
      next(err);
    }
  }
});

// -----------------------------------------------------
// GET /books/:id — Show book detail form
// -----------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      res.render('update_book', { title: 'Update Book', book });
    } else {
      const error = new Error('Book Not Found');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------
// PUT /books/:id — Update book in database
// -----------------------------------------------------
router.put('/:id', async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (book) {
      // Update the book
      await book.update(req.body);

      // Redirect to the last page so the updated book is visible
      const totalBooks = await Book.count();
      const lastPage = Math.ceil(totalBooks / 10);

      return res.redirect(`/books?page=${lastPage}`);
    } else {
      const error = new Error('Book Not Found');
      error.status = 404;
      throw error;
    }

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const book = await Book.findByPk(req.params.id);

      return res.render('update_book', { 
        title: 'Update Book',
        book: { ...req.body, id: req.params.id },
        errors: err.errors 
      });
    } else {
      next(err);
    }
  }
});


module.exports = router;