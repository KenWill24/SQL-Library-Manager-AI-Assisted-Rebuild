var express = require('express');
var router = express.Router();

// Home route
router.get('/', (req, res) => {
  res.render('index', { title: 'Library Manager' });
});

module.exports = router;
