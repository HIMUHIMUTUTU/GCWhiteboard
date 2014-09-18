
/*
 * GET home page.
 */

exports.view= function(req, res){
  res.render('gcsfront', { title: 'GCSfront' });
};