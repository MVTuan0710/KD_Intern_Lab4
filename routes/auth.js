var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var router = express.Router();

router.get('/login',(req, res, next) =>{
  res.render('login');
});

module.exports = router;

