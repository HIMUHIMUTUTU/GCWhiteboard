/**
 * New node file
 */

var create_map = exports;


/** create map from wordlog
 * @I
 *	_k
 *	_w[]
 *		name
 *		contents 
 *			*
 *		created
 * @O 
 *	logmap 
 *		id
 *		user_name
 *		log
 *		center_x
 *		center_y
 *		date	 
 * **/

create_map.getlogmap = function(_k, _w){
	
	var logmap = new Array();
	
	
	
	for(var ci = 0; ci < _w.length; ci++){
		
		logmap[ci] = {};
		
		//parse wordlog
		var wordlogdata = JSON.parse(_w[ci].contents);
		
		for(var i = wordlogdata.length - 1; i >= 0; i--){
			
			//find keyword and coor
			for(var ii = 0; ii < wordlogdata[i].words.length; ii++){
				if(wordlogdata[i].words[ii].word == _k){
					logmap[ci].id = ci; 
					logmap[ci].user_name = _w[ci].name; 
					logmap[ci].log = wordlogdata[i];
					logmap[ci].center_x = wordlogdata[i].words[ii].x;
					logmap[ci].center_y = wordlogdata[i].words[ii].y;
					logmap[ci].date = _w[ci].created; 
					break;
				}
			}
			if("id" in logmap[ci]){
				break;
			}
		} 
	}
	
	//console.dir(logmap);
	return logmap;
};
