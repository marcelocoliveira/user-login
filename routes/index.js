
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.failftw = function(req, res){
  throw new Error('Fail Whale');
};