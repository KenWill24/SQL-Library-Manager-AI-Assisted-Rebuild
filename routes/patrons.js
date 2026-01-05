const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Patron } = require('../models');

// -----------------------------------------------------
// GET /patrons — List all patrons
// -----------------------------------------------------
router.get("/", async (req, res, next) => {
  try {
    const limit = 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";

    const searchFilter = search
      ? {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { library_id: { [Op.like]: `%${search}%` } },
            { address: { [Op.like]: `%${search}%` } },
            { zip_code: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const totalPatrons = await Patron.count({ where: searchFilter });

    const patrons = await Patron.findAll({
      where: searchFilter,
      limit,
      offset: (page - 1) * limit,
      order: [["last_name", "ASC"]],
    });

    const totalPages = Math.ceil(totalPatrons / limit);

    res.render("all_patrons", {
      patrons,
      search,
      page,
      totalPages,
      noResults: patrons.length === 0,
    });
  } catch (error) {
    next(error);
  }
});

// -----------------------------------------------------
// GET /patrons/new — New patron form
// -----------------------------------------------------
router.get('/new', (req, res) => {
  res.render('new_patron', { title: 'New Patron', patron: {} });
});

// -----------------------------------------------------
// POST /patrons/new — Create patron with auto library_id
// -----------------------------------------------------
router.post('/new', async (req, res, next) => {
  try {
    const lastPatron = await Patron.findOne({
      order: [['library_id', 'DESC']]
    });

    const nextLibraryId = lastPatron ? lastPatron.library_id + 1 : 1;

    await Patron.create({
      ...req.body,
      library_id: nextLibraryId
    });

    // Redirect to last page 
    const totalPatrons = await Patron.count(); 
    const lastPage = Math.ceil(totalPatrons / 10);

    res.redirect(`/patrons?page=${lastPage}`);

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      res.render('new_patron', {
        title: 'New Patron',
        // <-- persist form data
        patron: req.body,
        // <-- show only validation errors
        errors: err.errors
      });
    } else {
      next(err);
    }
  }
});


// -----------------------------------------------------
// GET /patrons/:id — Patron detail form
// -----------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const patron = await Patron.findByPk(req.params.id);

    if (patron) {
      res.render('update_patron', { title: 'Update Patron', patron });
    } else {
      const error = new Error('Patron Not Found');
      error.status = 404;
      throw error;
    }
  } catch (err) {
    next(err);
  }
});

// -----------------------------------------------------
// PUT /patrons/:id — Update patron
// -----------------------------------------------------
router.put('/:id', async (req, res, next) => {
  try {
    const patron = await Patron.findByPk(req.params.id);

    if (!patron) {
      const error = new Error('Patron Not Found');
      error.status = 404;
      throw error;
    }

    // Update the patron
    await patron.update(req.body);

    // Redirect to the last page so the updated patron is visible
    const totalPatrons = await Patron.count();
    const lastPage = Math.ceil(totalPatrons / 10);

    return res.redirect(`/patrons?page=${lastPage}`);

  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      return res.render('update_patron', {
        title: 'Update Patron',
        patron: { ...req.body, id: req.params.id },
        errors: err.errors
      });
    } else {
      next(err);
    }
  }
});


module.exports = router;
