/**
 * New node file
 */

var create_talk = exports;

//create talk from hatena
create_talk.hatena = function(_w){
	var original = _w[0];
	
	var talk = [];
	talk[0] = original + "..." + original + "...";
	talk[1] = "うーん...";
	talk[2] = "『じしょ』をみるね...";
	
	if(_w.length == 1){
	talk[3] = "みつからないよ...";
	////console.dir(talk);
	exit();
	}
	
	////console.dir(_w);
	talk[3] = "...";
	
	var i = 1;
	while(i < _w.length){
		//decorate newword
		var newword = "";
		if(_w[i].indexOf(original) != -1){
			var words = _w[i].split(original);
			newword = words[0];
			for(var wi = 1; wi < words.length; wi++ ){
				newword += "“" + original + "”" + words[wi]; 
			}
		}else{
			newword = _w[i];
		}
		talk[3+i] = "「" + newword + "」っていうよね...";
		i++;
		
		//decorate newdescription
		var newdescription = "";
		if(_w[i].indexOf("。") != -1){
			var descriptions = _w[i].split("。");
			newdescription = descriptions[0];
			//newdescription.replace(/<.+?>/g,"");
			talk[3+i] = "「" + newdescription + "」だって...";
		}else{
			talk[3+i] = "いみはなんだったかな...";
		}
		
		i++;
	}
	
	//console.dir(talk);
	return talk;
};

//create talk from hatena
create_talk.map = function(_k, _w){
	var original = _k;
	
	var talk = [];
	talk[0] = original + "..." + original + "...";
	talk[1] = "うーん...";
	
	if(_w.length == 0){
		talk[2] = "そのことばはみたことがない...";
		////console.dir(talk);
		return talk;
		}
	talk[2] = "それはみたことがある...";
	
	for(var i = 0; i < _w.length; i++){
		var l = 4;
		talk[3 + i*l] = _w[i].user_name + "さんがそのことばをつかっていたよ...";
		talk[4 + i*l] = _w[i].date + "ごろのはなしだよ...";
		talk[5 + i*l] = "なにをかいていたかおもいだすね...";
		talk[6 + i*l] = "<map>" + i;
		if(i < _w.length  -1){
		talk[7 + i*l] = _w[i].date + "ほかにも...";
		}
	}
	
	//console.dir(talk);
	return talk;
}
