const express   = require('express');
const router =  express.Router();

//INDEX ROUTE
router.get('/', (req, res) => {
   res.render('index', {title: 'Home'}); 
});

module.exports = router;