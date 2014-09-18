/**
 * New node file
 */

var request = require('request');
var xml2js = require('xml2js');
var parser = new xml2js.Parser({trim: true, explicitArray: false});

function getHatenaWord(_w, callback){
	
	var options = {
		    url: 'http://search.hatena.ne.jp/keyword?word=' + encodeURIComponent(_w) + '&mode=rss2&ie=utf8&page=1',
		    headers: {
		        'User-Agent': 'request'
		    },proxy: 'http://proxy.noc.titech.ac.jp:3128'
	};
	
	//send get request to hatena.api
	request(options, function(error, response, hatena_xml) {
		console.log("hatena access");
	    if (!error && response.statusCode == 200) {
	    	parser.parseString(hatena_xml, function (err, result) {
	        	
	    		//proceed returned data
	    		var items = result.rss.channel.item;
	    		var wlist = [];
	         	//console.log(items);
	    		wlist.push(_w);
	    		
	         	if(items == null){	
	         		
	         	}else if(!(items instanceof Array)){
	         		wlist.push(items.title);
	         		wlist.push(items.description);
	         		
	    	    }else{
    	            for(var wi = 0; wi <items.length; wi++){
    	            	wlist.push(items[wi].title);
    	            	wlist.push(items[wi].description);
    	            }
	    	    }
	         	//console.log(wlist);
	         	callback(wlist);
	    	});
	    }
	});
}

module.exports = getHatenaWord;
