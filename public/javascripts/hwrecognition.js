var socket = io.connect();

var agent_data;

function getPosition(evt){
	if (evt) { evt = evt; } else if(event){ evt = event; }else{ evt = null; };
	var left = 0;
	var top = 0;
	
	
	if (evt.pageX) {
		left = evt.pageX;
		top  = evt.pageY;
		//console.log("evt.pageX:" + evt.pageX + ",evt.pageY:" + evt.pageY);
	} else {
		left = evt.clientX + document.documentElement.scrollLeft;
		top  = evt.clientY + document.documentElement.scrollTop;
		//console.log("document.documentElement.scrollLeft:" + document.documentElement.scrollLeft + ",document.documentElement.scrollTop:" + document.documentElement.scrollTop);
	}
	return {x : left, y : top}; 
}

window.onload = function() {
	var tomoe = new TOMOE();

};

function TOMOE (){
	
	//set canvas
	var canvas = document.getElementById('canvas');
	this.canvas = canvas;
	
	//mouse function
	var self = this;
	canvas.onmouseup   = function(event) { self.mouseup(event); }
	canvas.onmousedown = function(event) { self.mousedown(event); }
	canvas.onmousemove = function(event) { self.mousemove(event); }
	
	//offset values
	var left = 0;
	var top = 0;
	for (var o = canvas; o ; o = o.offsetParent) {
	  left += (o.offsetLeft - o.scrollLeft);
	  top  += (o.offsetTop - o.scrollTop);
	}
	this.offsetLeft = left;
	this.offsetTop  = top;
	  
	this.clear();
}

TOMOE.prototype.clear = function()
{
  this.active = false;
  this.sequence = [];
  this.point_num = 0;
  this.stroke_num = 0;
  this.prev_x = -1;
  this.prev_y = -1;

  var o = this.canvas;
  while (o.firstChild) {
    o.removeChild(o.firstChild);
  }
}

TOMOE.prototype.mouseup = function(event)
{
  this.trace(event);
  this.finishStroke();
  this.sendStroke();
};

TOMOE.prototype.mousemove = function(event)
{
  this.trace(event);
};

TOMOE.prototype.mousedown = function(event) 
{
  this.active = true;
  this.trace(event);
};


TOMOE.prototype.trace = function (event)
{
  if (! this.active) return;
  var pos = getPosition(event);
  this.addPoint(pos.x, pos.y);
}

TOMOE.prototype.addPoint = function(x, y)
{
  var x2 = x - this.offsetLeft;
  var y2 = y - this.offsetTop;
  if (this.point_num == 0){ 
	  this.sequence[this.stroke_num] = new Array;
  }
  
  this.sequence[this.stroke_num][this.point_num] = { x:x2, y:y2 };
  this.point_num++;

  if (this.prev_x != -1) {
    this.drawLine(this.prev_x, this.prev_y, x, y);
  } else {
    this.drawDot(x, y);
  }  

  this.prev_x = x;
  this.prev_y = y;
};

TOMOE.prototype.drawLine = function(x1,y1,x2,y2) 
{
  if (x1 == x2 && y1 == y2) return;

  var x_move = x2 - x1;
  var y_move = y2 - y1;
  if(x_move < 0){ var x_diff = 1; }else{ x_diff = -1;}
  if(y_move < 0){ var y_diff = 1; }else{ y_diff = -1;}

  if (Math.abs(x_move) >= Math.abs(y_move)){
    for (var i = x_move; i != 0; i += x_diff) {
      this.drawDot(x2 - i, y2 - Math.round(y_move * i / x_move));
    }
  } else {
    for (var i = y_move; i != 0; i += y_diff) {
      this.drawDot(x2 - Math.round(x_move * i / y_move), y2 - i);
    }
  }
};

TOMOE.prototype.drawDot = function(x,y)
{
  var dot = document.createElement("span");
  dot.style.left = x  + "px";
  dot.style.top =  y  + "px";
  dot.className = "dot";
  this.canvas.appendChild(dot);
};

TOMOE.prototype.finishStroke = function()
{
  this.active = false;
  this.point_num = 0;
  this.stroke_num++;
  this.prev_x = -1;
  this.prev_y = -1;
};

TOMOE.prototype.sendStroke = function(event)
{
  console.log(this.sequence);
  socket.emit('description', { value: this.sequence });
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
	socket.on('recogwords', function(data) {
	  console.dir(data.value);
});

    

