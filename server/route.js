const express = require('express');
const router= express.Router();


router.post('/signup',function(req,res){
  res.send({'name':'Gbenga'});
});

module.exports = router;
