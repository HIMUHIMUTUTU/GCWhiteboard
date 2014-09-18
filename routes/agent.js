
/*
 * GET home page.
 */

exports.view= function(req, res){
  res.render('agent', { title: 'Agent' });
};