var express = require('express');
var router = express.Router();

// Home route
// Home route
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Library Manager',
    showHomeLink: true
  });
});


module.exports = router;