 
//var agentloop = function() {
//	
//	
//	/**
//	for(var li = 0; li < log.length; li++){
//		logarray = log[li].log.split(",");
//		if(logarray[2] == "DROPGOMI"){
//			if(logarray[5] < frame_x + frame_w){
//				wordsIdOnFrame.push(logarray[4]);
//			}
//		}
//	}
//	**/
//	
//	var wordsIdOnFrame = [];
//	 for(var i=0; i<gomi.length; i++){
//	    	if(gomi[i].xPos < frame_x + frame_w){
//	    		wordsIdOnFrame.push([i, gomi[i].name]);	 
//	    	}
//	 }
//	 
//	 console.log(wordsIdOnFrame);
//
//	 if(wordsIdOnFrame.length != 0){
//			 var logArray = [];
//			 var lli = 0;
//			 
//			 for(var li = 0; li < log.length; li++){
//					la = log[li].log.split(",");
//					if(la[2] == "DROPGOMI" || wordsIdOnFrame.indexOf((la[3])) != -1){
//						logArray.push([Number(la[0]), la[3] ,la[4]]);
//						lli++;
//					}
//			 }
//			 
//			 console.log(logArray);
//			 //var aid = Math.floor( Math.random() * (wordsIdOnFrame.length));
//		 
//		 lli = lli - 1;
//		 //console.log("a:" + lli);
//		 
//		 //console.log(gomi[wordsIdOnFrame[wordsIdOnFrame.length - 1]].name);
//		
//		hatena(wordsIdOnFrame).done(function(msg) {
//		});
//			 
//		//はてなapi	 
//		function hatena(wiof){
//			var d = $.Deferred();
//			
//			var words = "";
//			for(var wi = 0; wi <wiof.length; wi++){
//				if(wi != 0){
//				words += ","
//				}	
//				words += wiof[wi][1];
//			}
//			
//			$.ajax({
//				type: "GET",
//				url: "http://localhost/~kentaro/GCSfront/framework/public/phpfiles/hatena.php?w=" + words,
//		        success: function(msg){
//		        	console.log(msg);
//			        var gaj = eval("("+msg+")");
//			        console.log(gaj);
//			        var results = gaj.results;
//			        	for(var wii=0 ; wii <wiof.length; wii++){
//			        		console.log(results[wii].channel);
//			        		
//			        		var k = [];
//			        		for (keys in results[wii].channel){
//			        				k.push(keys);
//			        			}
//			        		
//			        		if(keys.indexOf("item") == -1){
//			        			console.log("noitem");
//			        			return;
//			        		}
//			        		
//			        		
//			        		var items = results[wii].channel.item;
//			        		console.log(items);
//				        	
//			        		if(!(items instanceof Array)){
//				            	agentWord[aw] = new AgentWord(aw , items.title, wiof[wii][0], 2, order, 0);
//				            	console.log(agentWord[aw]);
//				            	aw++;
//		            			order++;
//		            			
//			        		}else if(items.length == 0){
//				           	 	console.log("NO DATA");
//				           	 	
//				            }else{
//
//				            var wlist = [];
//				            for(var gci = 0; gci <items.length; gci++){
//				            	wlist.push(items[gci].title);
//				            }
//				            console.log(wlist);
//				            
//					        for(var wli = 0; wli < wlist.length; wli++){
//					            	var wn = wlist[wli].indexOf(wiof[wii][1]);
//					            		if(wn != -1){
//					            		var aword = wlist[wli].split(wiof[wii][1]);
//					            		console.log(aword);
//					            		
//					            		for(var awi = 0; awi < aword.length; awi++){
//					            		if(aword[awi] != ""){
//					            			//id, name, gomiid, relation, order, appearorder
//					            			agentWord[aw] = new AgentWord(aw , aword[awi], wiof[wii][0], awi, order, wli);
//					            			console.log(agentWord[aw]);
//					            			aw++;
//					            			order++;
//					            		}
//					            		}
//					            		}else{
//					            			agentWord[aw] = new AgentWord(aw , wlist[wli], wiof[wii][0], 2, order, wli);
//					            			aw++;
//					            			order++;
//					            		}
//					        }
//				            }
//				            
//				            }
//		        	d.resolve();
//		        }
//			});
//			return d.promise();
//		}
//
//		
//		/**
//		 $.ajax({
//		        type: "GET",
//		        url: "./hatena.php?w=" + logArray[lli][2],
//		        
//		        success: function(msg){
//		        console.log(msg);
//		        var gaj = eval("("+msg+")");
//		        console.log("HATENA CONNECTION SUCCESS");
//		        console.log(gaj);
//		        	//関連タイトルデータ抽出
//		        	var items = gaj.results.channel.item;
//		        	console.log(items);
//		        	
//		            if(items.length == 0){
//		           	 	console.log("NO DATA");
//		            }else{
//		            var wlist = [];
//		            for(var gci = 0; gci <gaj.results.channel.item.length; gci++){
//		            	wlist.push(gaj.results.channel.item[gci].title);
//		            }
//		            console.log(wlist);
//		            
//		            if(wlist.length != 0){
//			        for(var wli = 0; wli < wlist.length; wli++){
//			            	var wn = wlist[wli].indexOf(logArray[lli][2]);
//			            		if(wn != -1){
//			            		var aword = wlist[wli].split(logArray[lli][2]);
//			            		console.log(aword);
//			            		
//			            		for(var awi = 0; awi < aword.length; awi++){
//			            		if(aword[awi] != ""){
//			            			//id, name, gomiid, relation, order
//			            			agentWord[aw] = new AgentWord(aw , aword[awi], logArray[lli][1], awi, order);
//			            			console.log(agentWord[aw]);
//			            			aw++;
//			            			order++;
//			            		}
//			            		}
//			            		}else{
//			            			agentWord[aw] = new AgentWord(aw , wlist[wli], logArray[lli][1], 2, order);
//			            			aw++;
//			            			order++;
//			            		}
//			        }
//		            }
//		            }
//		        }//success
//		        });//ajax
//		        **/
//		 }
//	 setTimeout(agentloop, 30000);
// };
