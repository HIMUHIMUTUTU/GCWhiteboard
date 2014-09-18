/**
 * New node file
 */

var async = require('async');
var zinnia = require('../lib/node-zinnia/index');
var handwrite_recognition = exports;


/** recognize word from handwriting description
 * @I
 *	_d[]
 *		x
 *		y
 * @O 
 *	 recogwords[]
 *		word
 *		score	 
 * **/

handwrite_recognition.recogwords = function(_d, callback){
	var wordset = new Array();
	var di = 0;
	async.whilst(
			    function test() { return di < _d.letter.length; },
			    function (done) {
			    	usezinnia(_d.letter[di],function(recogwords){
			    		wordset[di] = {};
			    		wordset[di].x_id = _d.letter[di].x_id;
				    	wordset[di].y_id = _d.letter[di].y_id;
				    	wordset[di].recogwords = recogwords;
				    	di++;
				        done();
			    	});
			    },
			    function (err) {
			    	if(err){
			    		console.log(err);
			    	}else{
			    		console.log("fin!");
			    		callback(wordset);
			    	}
			    }
			);
};

var usezinnia = function(_l, callback){
	console.log("rec");
	console.dir(_l);
	
	var recogwords = new Array();
	var r = zinnia.Recognizer();
	var s = zinnia.Character();
	
	if(r.open('/usr/local/lib/zinnia/model/tomoe/handwriting-ja.model')){
		  s.clear();
		  s.set_width(80);
		  s.set_height(80);
		  
		  for(var li = 0; li < _l.stroke.length; li++){
			  for(var lii = 0; lii < _l.stroke[li].x.length; lii++){
				  s.add(li, _l.stroke[li].x[lii] - _l.x, _l.stroke[li].y[lii] - _l.y);
				  console.log(li + "," + (_l.stroke[li].x[lii] - _l.x) + "," + (_l.stroke[li].y[lii] - _l.y));
			  }
		  }
		  
		  r.classify(s, 10, function(result){
		    var size = result.size();
		    for(var i=0; i<size; i++){
		    	recogwords[i] = {};
		    	recogwords[i].word = result.value(i);
		    	recogwords[i].score = result.score(i);
		    }
		    console.dir(recogwords);
			callback(recogwords);
		  });
		  
		}else{
		  console.log('model can\'t open');
		  callback(null);
		}
	
};
