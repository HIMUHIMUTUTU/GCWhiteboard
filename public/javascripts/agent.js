var socket = io.connect();

var agent_data;
var ti = 0;

window.onload = function() {
	//set canvas
	var canvas = document.getElementById('canvas');
	var cc = canvas.getContext('2d');
	
	//load images
	var fukidashi = new Image();
		fukidashi.src = "/images/config/fukidashi.png";
	var techchan = new Image();
		techchan.src = "/images/config/techchan.png";
	
	//set font
		cc.textBaseline = "middle";
		cc.textAlign = "center";
		
	loop(cc, fukidashi, techchan);
};

socket.on('connect', function(msg) {
  console.log("connet");
    
  	var clientinfo = {
			type: 'agent'
	};
  	//authentication
    socket.emit('auth', clientinfo);
});

// case receive talk
	socket.on('talk', function(data) {
	  console.log(data);
  	  agent_data = data.value;
  	  ti = 0;
  	  console.log(agent_data.map);
  	
});

var loop = function(cc, _f, _t){
	var interval = 5000;
	
	//reset canvas
	cc.fillStyle = '#ffffff';
	cc.fillRect(0, 0, canvas.width,canvas.height);
	cc.drawImage(_f, 0, 0);
	cc.drawImage(_t, 280, 400);
	
	
	if(agent_data != null && ti < agent_data.talk.length){
		
		//output map
		if(agent_data.talk[ti].indexOf('<map>') != -1){
			cc.font = 15 + "px 'ヒラギノ明朝 ProN W6'";
			var mapseq = agent_data.talk[ti].substr(5, 1);
			var x = agent_data.map[mapseq].center_x;
			var y = agent_data.map[mapseq].center_y;
				for(var i = 0; i < agent_data.map[mapseq].log.words.length; i++){
					var sizerate = 0.25;
					var aw = agent_data.map[mapseq].log.words[i];
					if(aw.x == x && aw.y == y){
						cc.fillStyle = '#A52A2A';
					}else{
						cc.fillStyle = '#808080';
					}
					if(Math.abs(aw.x-x) < 250 && Math.abs(aw.y-y) < 150){
						cc.fillText(aw.word, aw.x-x+350, aw.y-y+200);
					}
					console.log(aw.word);
					interval = 20000;
				}
		}else{
			//output talk
			cc.font = "30px 'ヒラギノ明朝 ProN W6'";
			cc.fillStyle = '#696969';
			fillMultilineText(cc, agent_data.talk[ti], 350, 60, 500);
			interval = Math.floor( Math.random() * 2000 ) + 7000;
		}
		
		ti++;
	}
	setTimeout(loop, interval, cc, _f, _t);
}


/**
 * output multiline text 
 * http://gam0022.net/blog/2013/09/16/canvas-memo/
**/

function fillMultilineText(context, text, x, y, width) {
    var len = text.length;
    var strArray = [];
    var tmp = "";
    var i = 0;

    if( len < 1 ){
        //textの文字数が0だったら終わり
        return strArray;
    }

    for( i = 0; i < len; i++ ){
        var c = text.charAt(i);  //textから１文字抽出
        if( c == "\n" ){
            /* 改行コードの場合はそれまでの文字列を配列にセット */
            strArray.push( tmp );
            tmp = "";

            continue;
        }

        /* contextの現在のフォントスタイルで描画したときの長さを取得 */
        if (context.measureText( tmp + c ).width <= width){
            /* 指定幅を超えるまでは文字列を繋げていく */
            tmp += c;
        }else{
            /* 超えたら、それまでの文字列を配列にセット */
            strArray.push( tmp );
            tmp = c;
        }
    }

    /* 繋げたままの分があれば回収 */
    if( tmp.length > 0 )
        strArray.push( tmp );
    
    /* 出力 */
    for(var i = 0; i < strArray.length; i++){
    	context.fillText(strArray[i], x , y + 40*i);
	}
    
}

