/* Variables definition */
var frame = {
	draw: {x: 0, y: 50, w: 1280, h: 750},
	config: {x: 0, y: 0, w: 1280, h: 10},
	gomi: {x: 0, y: 0, w: 0, h: 0}
};

var mode_status = {
	focus_word: null, drag_word: null,
	mode: 0,
	isDrag: false, isDraw: false, isErase: false
};

var path = {
	configimage: "/images/config/"
};

/** socket action **/
var clientinfo = {
			type: 'garbage'
		};
var socket = io.connect();
socket.on('connect', function(msg) {
  console.log("socket.io conneted");

  //authentication
  	socket.emit('auth', clientinfo);
});


/** MAIN Object **/
window.onload = function() {
	var main = new MAIN();
};

function MAIN(){

//time initialization
this.timer =new Timer();

//get log que
var wordlogque = 1;

//load canvas
var canvas = document.getElementById('canvas');
var canvaswrap = document.getElementById('canvas-wrap');
var overlay = document.getElementById('overlay');
var cc = canvas.getContext('2d');
this.canvas = canvas;
this.overlay = overlay;
this.cc = cc;

//offset values
var left = 0;
var top = 0;
for (var o = canvas; o ; o = o.offsetParent) {
  left += (o.offsetLeft - o.scrollLeft);
  top  += (o.offsetTop - o.scrollTop);
}
this.offsetLeft = left;
this.offsetTop  = top;

//area 
cc.fillStyle = '#d3d3d3';
cc.fillRect(0,0,this.canvas.width,this.canvas.height);
cc.fillStyle = '#ffffff';
cc.fillRect(frame.draw.x ,frame.draw.y ,frame.draw.w ,frame.draw.h);

//grid
var gridsize = 80;
this.grid = new Array();
for(var gxi = 0; gxi*gridsize < frame.draw.w; gxi++){
	this.grid[gxi] = new Array();
	for(var gyi = 0; gyi*gridsize < frame.draw.h; gyi++){
		this.grid[gxi][gyi] = new Grid(gxi + (frame.draw.w / gridsize)*gyi, frame.draw.x + gxi * gridsize, frame.draw.y + gyi * gridsize, gridsize, gridsize);
		this.grid[gxi][gyi].display(cc);
	}
}

//image
var image = new Array();
var image_num = 3;
for(var ii = 0; ii < image_num; ii++){
	image[ii] = new Image();
	image[ii].src = path.configimage + "box" + ii +".png";
}

//box
this.box = new Array();
this.box[0] = new Toolbox(0, 20, 10, 1, image[1]);
this.box[1] = new Toolbox(1, 60, 10, 2, image[2]);
var bself = this.box;
image[image_num - 1].onload = function(){
	for(var bi = 0; bi < bself.length; bi++){
		bself[bi].display(cc);
	}
};

//line
this.line = new Array();
this.line_num = 0;

//define mouse function
var self = this;
canvaswrap.onmouseup   = function(event) { self.mouseup(event); };
canvaswrap.onmousedown = function(event) { self.mousedown(event); };
canvaswrap.onmousemove = function(event) { self.mousemove(event); };

//recognition
this.recogchar = new Array();

var log = new Array();
var lo = 0;

var wordlog = new Array();
var wlo = 0;

this.rloopcount = -1;
var rloop = function(){
	if(self.rloopcount == 0){
		self.wordRecognition();
	}
	if(self.rloopcount >= 0){
		self.rloopcount--;
	}
	setTimeout(rloop, 1000);
};
rloop();

};


/* mousedown function */
MAIN.prototype.mousedown = function(event){
	
	//get mouse position
	var pos = this.getRelPosition(event);
	
	//draw line
	if(inFrame(pos.x, pos.y, frame.draw)){
		if(mode_status.mode == 1){
			this.line[this.line_num] = new Line(this.line_num);
			mode_status.isDraw = true;
			this.markGrid(pos);
			this.draw();
			return;
			//log[lo] = new Log(timer.gettime(),"STARTDRAW," + li + "," + actionMode);
		}
	}
	
	//click box
	for(var i = 0; i < this.box.length; i++){
		if(inFrame(pos.x, pos.y, this.box[i])){
				mode_status.mode = this.box[i].mode;
				this.refleshTookBox(this.box[i].id);
				return;
				//log[lo] = new Log(timer.gettime(),"SELECTMODE," + actionMode);
		}
	}
};

/* mousemove function */
MAIN.prototype.mousemove = function(event){
	if(mode_status.isDraw){
			this.draw();
	};
};

/* mouseup function */
MAIN.prototype.mouseup = function(event){
	if(mode_status.isDraw){ 
		this.draw();
		this.line_num++;
		//this.sendDraw();
		mode_status.isDraw = false;
		this.rloopcount = 5;
	};
};

/* get relative position */
MAIN.prototype.getRelPosition = function(event){
	var pos = getPosition(event);
	var rx = pos.x - this.offsetLeft;
	var ry = pos.y - this.offsetTop;
	return {x: rx, y: ry};
};

/* reflesh tool box */
MAIN.prototype.refleshTookBox = function(_i){
for(var i = 0; i < this.box.length; i++){
	if(this.box[i].id == _i){
		this.box[i].status_flag = 2;
	}else{
		this.box[i].status_flag = 1;
	}
	this.box[i].display(this.cc);
}
};

/* mark active grid */
MAIN.prototype.markGrid = function(pos){
	this.line[this.line_num].grid_x = Math.floor((pos.x - frame.draw.x) / this.grid[0][0].w);
	this.line[this.line_num].grid_y = Math.floor((pos.y - frame.draw.y) / this.grid[0][0].w);
};

/* draw function */
MAIN.prototype.draw = function(event){
  
  //get mouse position
  var pos = this.getRelPosition(event);
  
  if(inFrame(pos.x, pos.y, frame.draw)){
	  //draw line
	  this.line[this.line_num].add(pos.x, pos.y);
	  this.line[this.line_num].display(this.overlay);
  }
};


/* word recognition loop */
MAIN.prototype.wordRecognition = function(){
		var letter = new Array();
		var lei = 0;
		for(var gyi = 0; gyi < this.grid[0].length; gyi++){
		for(var gxi = 0; gxi < this.grid.length; gxi++){
		if(this.recogchar.indexOf(this.grid[gxi][gyi].id) == -1){ //if new grid 
			var stroke = new Array();
			var si = 0;
			for(var li = 0; li < this.line.length; li++){
				if(this.line[li].grid_x == gxi && this.line[li].grid_y == gyi){
					stroke[si] = this.line[li];
					si++;
					this.recogchar.push(this.grid[gxi][gyi].id); //regist grid to list
				};
			};
			if(si != 0){
				letter[lei] = {x_id:gxi, y_id:gyi, x:this.grid[gxi][gyi].x, y: this.grid[gxi][gyi].y, stroke: stroke };
				lei++;
			}
		};
		};
		};
		socket.emit('recognition', {value: {letter: letter}});
		console.log({value: {letter: letter}});
};

/* Main loop */
var loop = function() {
		//get wordlog
		if(sec % 10 == 0 && wordlogque == 1){
			wordlog[wlo] = new WordLog(Math.round(time/1000));
			 for(var i=0; i<gomi.length; i++){
			    	if(gomi[i].xPos < frame_x + frame_w){
			    		var wordloglist = new WordLogList(gomi[i].name, gomi[i].xPos, gomi[i].yPos);
			    		wordlog[wlo].words.push(wordloglist);
			    	};
			 }
			 console.dir(wordlog[wlo]);
			 wlo++;
			 wordlogque = 0;
		}else if(sec % 10 == 9){
			 wordlogque = 1;
		}
		
		//get manipulatelog
		
		setTimeout(loop, 100);
};


/** Timer Object **/
function Timer(){
	var date = new Date();
	this.starttime = date.getTime();
}

Timer.prototype.gettime = function(){
	var date =new Date();
	var currenttime = date.getTime();
	this.time = currenttime - this.starttime;
	return this.time;
};


/** Toolbox Object **/
function Toolbox(_i, _x, _y, _m, _im){
	this.id = _i;
	this.x = _x;
	this.y = _y;
	this.w = 30;
	this.h = 30;
	this.mode = _m;
	this.image  = _im;
	this.status_flag = 1; //1:non-focus 2:focus
	
}

/* display toolbox */
Toolbox.prototype.display = function(cc){
	cc.lineWidth = 1;
	cc.strokeStyle='#ffffff';
	cc.strokeRect(this.x, this.y, this.w, this.h);
	cc.drawImage(this.image, this.x, this.y, this.w, this.h); //icon
	
	if(this.status_flag == 2){
		cc.strokeStyle='#ffd700';
	}else{
		cc.strokeStyle='#d3d3d3';
	}
	cc.lineWidth = 2;
	cc.strokeRect(this.x-2, this.y-2, 34, 34);
};


/** Line Object **/
function Line(_i){
	  this.id = _i;
	  //this.color = _lc;
	  //this.width = _lw;
	  this.x = new Array();
	  this.y = new Array();
	  this.status_flag = 1;
	  this.grid_x;
	  this.grid_y;
}

/* add */
Line.prototype.add = function(_x,_y){
	  this.x.push(_x);
	  this.y.push(_y);
};

/* display */
Line.prototype.display = function(_c){
	
	//draw first dot 
	if(this.x.length == 1){
		this.drawDot(this.x[this.x.length - 1], this.y[this.y.length - 1], _c);
		return;
	}
	
	// complement point and draw dot
	var x_move = this.x[this.x.length - 1] - this.x[this.x.length - 2];
	var y_move = this.y[this.y.length - 1] - this.y[this.y.length - 2];
	
	if(x_move < 0){ var x_diff = 1; }else{ x_diff = -1;}
	if(y_move < 0){ var y_diff = 1; }else{ y_diff = -1;}
	if (Math.abs(x_move) >= Math.abs(y_move)){
	    for (var i = x_move; i != 0; i += x_diff) {
	      this.drawDot(this.x[this.x.length - 1] - i, this.y[this.y.length - 1] - Math.round(y_move * i / x_move), _c);
	    };
	} else {
	    for (var i = y_move; i != 0; i += y_diff) {
	      this.drawDot(this.x[this.x.length - 1] - Math.round(x_move * i / y_move), this.y[this.y.length - 1] - i, _c);
	    };
	};
};

/* drawDot */
Line.prototype.drawDot = function(_x, _y, _c){
		var dot = document.createElement("span");
		  dot.style.left = _x  + "px";
		  dot.style.top =  _y  + "px";
		  dot.className = "dot";
		  _c.appendChild(dot);
};

/** Grid Object **/
function Grid(_i, _x, _y, _w, _h){
	this.id = _i;
	this.x = _x;
	this.y = _y;
	this.w = _w;
	this.h = _h;
	this.status_flag = 1; //1: normal 2: written
}

/* display */
Grid.prototype.display = function(cc){
	cc.lineWidth = 0.2;
	cc.strokeStyle='#ADD8E6';
	cc.strokeRect(this.x, this.y, this.w, this.h);
};


/** Log Object **/
function Log(_t, _l){
	this.log = lo + "," + _t + "," + _l;
	console.log(this.log);
	lo++;
}


/** Wordlog Object **/
function WordLog(_t){
	this.time = _t;
	this.words = new Array();
}
function WordLogList(_w, _x, _y){
	this.word = _w;
	this.x = _x;
	this.y = _y;
}



/** Get position **/
function getPosition(evt){
	if (evt) { evt = evt; } else if(event){ evt = event; }else{ evt = null; };
	var left = 0;
	var top = 0;
	
	if (evt.pageX) {
		left = evt.pageX;
		top  = evt.pageY;
	} else {
		left = evt.clientX + document.documentElement.scrollLeft;
		top  = evt.clientY + document.documentElement.scrollTop;
	}
	return {x : left, y : top}; 
}


/** Judge mouse is in object**/
function inFrame(_x, _y, _obj){
	if(_x > _obj.x && _x < _obj.x + _obj.w && _y > _obj.y && _y < _obj.y + _obj.h){
		return true;
	}else{
		return false;
	}
};
