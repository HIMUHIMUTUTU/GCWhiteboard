/**
 * New node file
 */
var hatena = require('./models/hatena');
var create_talk = require('./models/create_talk');
var create_map = require('./models/create_map');
var referlog = require('./models/referlog');
var handwrite_recognition = require('./models/handwrite_recognition');
var app = module.parent.exports;
var io = app.get('io');
var client = {agent:{}, garbage:{}};

//case of receive connection of client 
io.sockets.on('connection', function(socket) {
	
  //authentication and ID management
  socket.on('auth', function(data){
	  client[data.type][socket.id] = socket;
	  console.dir(client);
  }); 
 	
  
  /** case of get message from client 
   * @I keyword 
   * @O agent_data 
	 * 		talk_data 
	 * 		append_data		
	 * 			map_data
   * **/
  socket.on('keyword', function(data) {

	var keyword = data.value;
	console.log("receive keyword:" + keyword);

	var agent_data = {};
	
	//var mode = 'hatena';
	mode = 'wordlog';
	
	switch (mode){
	case 'hatena':
		//get related words from hatena api
		hatena(keyword, function(hatena_data){
			console.dir(hatena_data);
			
			//create talk message
		    agent_data.talk = create_talk.hatena(hatena_data);
		    
		    //send it to agent
		    for (key in client['agent']){
		    	var csocket = client['agent'][key]
		    	csocket.emit('talk', { value: agent_data });
		    	//console.log("sendto:" + client['agent'][key]);
		    }
		});
	break;
	
	case 'wordlog':
		//select wordlog from database
		  referlog.select(keyword, function(data){
		  	
			//create map
			var map_data = create_map.getlogmap(keyword, data);
			agent_data.map = map_data;
			
			//create talk message
			agent_data.talk = create_talk.map(keyword, map_data);
			
			//send it to agent
		    for (key in client['agent']){
		    	var csocket = client['agent'][key]
		    	csocket.emit('talk', { value: agent_data });
		    	//console.log("sendto:" + client['agent'][key]);
		    }
			
		  });
	break;
	}
	  
  });
  
  //receive wordlog
  socket.on('wordlog', function(data) {
	  console.log("receive wordlog:");
	  ////console.dir(data.value);

	  //convert JSON object to String 
	  data.value = JSON.stringify(data.value);
	  
	  //insert wordlog to database
	  referlog.insert(data.value, function(data){
	  	console.log("WORDLOG INSERTED");
	  });
	  
  });
  
  
  /** recognize description into words **/
  socket.on('recognition', function(data) {
	  console.log("receive recognition data:");
	  
	  //convert description into keywords by handwriting recognition
	  handwrite_recognition.recogwords(data.value, function(recogwords){
		
		console.log(recogwords);
		
		//make word from recogchar
		var word = new Array();
		var wi = -1;
		var pre_y = -1;
		var pre_x = -1;
		for(var i = 0; i < recogwords.length; i ++){
			if(recogwords[i].y_id == pre_y){
				if(recogwords[i].x_id == pre_x + 1){ 
					//next char
					word[wi] += recogwords[i].recogwords[0].word;
					pre_x = recogwords[i].x_id;
				}else{
					//new char
					wi++;
					word[wi] = recogwords[i].recogwords[0].word;
					pre_x = recogwords[i].x_id;
				}
			}else{
				wi++;
				word[wi] = recogwords[i].recogwords[0].word;
				pre_y = recogwords[i].y_id;
				pre_x = recogwords[i].x_id;
			}
		}
		
		console.dir(word);
		
		var agent_data = {};
		var keyword = word;
		
		//select wordlog from database
		  referlog.select(keyword, function(data){
		  	
			//create map
			var map_data = create_map.getlogmap(keyword, data);
			agent_data.map = map_data;
			
			//create talk message
			agent_data.talk = create_talk.map(keyword, map_data);
			
			//send it to agent
		    for (key in client['agent']){
		    	var csocket = client['agent'][key]
		    	csocket.emit('talk', { value: agent_data });
		    	//console.log("sendto:" + client['agent'][key]);
		    }
			
		  });
		  
		/**
		//send it to agent
		  for (key in client['agent']){
			  var csocket = client['agent'][key]
			  csocket.emit('recogwords', { value: recogwords });
		    }
	    **/
  	  });
  });
  
  /** クライアントが切断したときの処理 **/
  socket.on('disconnect', function(){
    console.log("disconnect");
  });
});



