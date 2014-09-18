/**
 * New node file
 */
 var database = require('./database');
 var db = database.createClient();
 var referlog = exports;
 
 // insert wordlog
 referlog.insert = function (_c, callback) {
	 
   db.query(
     'INSERT INTO logs '
       + '(contents, modified, created, status_flag) '
       + 'VALUES '
       + '(?, NOW(), NOW(), "1")'
       + ';',
     [_c], 
     function (err, results, fields) {
       db.end();
       //var sid = results.insertId;
       if (err) {
         callback(err);
         return;
       }
       callback(null);
     });
 };
 
 // select wordlog
 referlog.select = function (_k, callback) {
	console.log(_k);
   db.query(
     'SELECT l.contents, l.created, u.name '
	   + 'FROM logs AS l '
	   + 'INNER JOIN users AS u ' 
	   	+ 'ON l.user_id = u.id '
       + 'WHERE l.contents LIKE ? '
       + 'AND l.status_flag = "1" '
       + 'ORDER BY l.created ASC '
       + 'LIMIT 10'
       + ';',
     ['%' + _k + '%'], 
     function (err, results, fields) {
       db.end();
       //var sid = results.insertId;
       if (err) {
         callback(err);
         return;
       }
       callback(results);
     });
 };