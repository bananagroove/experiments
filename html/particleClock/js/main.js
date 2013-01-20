var FPS 			= 60;
var particleNum 	= 3000;
var _width 			= 500;
var _height 		= 500;
var _textSize		= 40;
var textPosition	= 0;
var fontName		= "Visitor1";

var CLOCK_VIEW 	= 0, TEXT_VIEW = 1;
var nowDisp 	= TEXT_VIEW;
var particles 	= [];
var ct 			= document.createElement('canvas');
var ctx 		= ct.getContext('2d');
ctx.fillStyle 	= '#fff';

var canvas = document.getElementById("canvas");
var info = document.getElementById("info");

ct.width  = canvas.width  = _width;
ct.height = canvas.height = _height;
canvas.onclick = mouseClick;

var cc = canvas.getContext("2d");

cc.fillStyle = 'rgba(0,0,0,0.01)';

cc.fillRect(0, 0, _width, _height);
bit = cc.getImageData(0, 0, _width, _height);
data = bit.data;
cc.clearRect(0, 0, _width, _height);
cc.fillStyle = "rgb(0, 255, 0)";

var updateState = false;
var textData;
var prev_time;
var updateTime = 1;
var textWidth;
var textHeight;
var setX, setY;

function setPixel(x, y){
  var idx = ((x|0) + (y|0) * _width)*4;
  data[idx+3] = 255;
}

function delPixel(x, y){
  var idx = ((x|0) + (y|0) * _width)*4;
  data[idx+3] = 0;
}

function faidout(){
  for (var i = 3, l = data.length;i < l;i+=4){
    var a = data[i];
    if (a !== 0){
      if (a < 36) {
        data[i] = 0;
      } else if (a < 66) {
        data[i] *= 0.96;
      } else {
        data[i] *= 0.7;
      }
    }
  }
}

var num = particleNum;
while(num){
  num--;
  particles[num] = new particle();
}
var last = Date.now(), count = 0;
setInterval(process, 1000/FPS);

function process() {
  
  ctx.clearRect(0, 0, _width, _height);
  var time = timeDraw();
  if (count == 0){
    updateState = true;
  }
  prev_time = time;
  if(updateState){
     
  	if (nowDisp === CLOCK_VIEW) {
	    //Clock
	      var textSize = _textSize;
	      var text = time;
	      textWidth = textSize*4.5;
	      textHeight = textSize;
	      setX = _width/2 - textSize*2.25;
	      setY = _height/2 - textSize/2;

	      ctx.font = textSize+"px "+fontName;
	      ctx.textBaseline = "top";
	      ctx.fillStyle = '#fff';
	      ctx.fillText(text, setX, setY);
	    } else if(nowDisp === TEXT_VIEW) {
	    //Text
      
	      textSize = _textSize;
	      var score=["","BANANA", "GROOVE", "STUDIOS", "WE", "LOVE", "CREATIVITY", "TECHNOLOGY", "ART", "CONCEPT", "ELETRONIC", "AUDIO", "VIDEO", "GAMES", "ILLUSTRATION", "DEVELOPMENT", "INSANITY", "COLLABORATION", "FRIENDSHIP", "HAPPINESS", "CHALLENGES", "LAUGHS", "JOKES", "AND", "OBVIOUS", "BEER", ": )", "; )", ": )", ": P"];
	      text=score[textPosition];
		  textPosition = textPosition < score.length-1 ? textPosition + 1 : 0;
	      textWidth = textSize * text.length;
	      textHeight = textSize;
	      setX = _width/2 - textSize * text.length/2 + 80;
	      setY = _height/2 - textSize/2;

	      ctx.font = textSize+"px "+fontName;
	      ctx.textBaseline = "top";
	      ctx.fillStyle = '#fff';
	      ctx.fillText(text, setX, setY);
	  }
  	updateState = false;
  	//Retrieves the Coordinates to Place the Particle
	if(textWidth <= 0 || textHeight <= 0)
		return;
    textData = ctx.getImageData(setX, setY, textWidth, textHeight).data;
  }
  var m, _i = 0;
  for (var x = 0; x < textWidth;x++) {
    for(var y = 0; y < textHeight; y++) {
      var idx  = (x+y*textWidth)*4;
      if(textData[idx] > 100) {
        _i++;
        m = particles[_i];
		if(!m)
			return;
        //Value from the current position to the target
        var X = x + setX - m.px;
        var Y = y + setY - m.py;
        var T = Math.sqrt(X*X + Y*Y);
        //Angle to the target from the current position
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);

        //Movement width
        m.x = m.px + C*T*0.15;
        m.y = m.py + S*T*0.15;
        setPixel(m.x+Math.random()*3-1.5, m.y+Math.random()*3-1.5);
        drawDotLine(m.x, m.y, m.px, m.py);
        m.ran += 0.0007;
        m.timeFlg = true;
        //m.center = true;
        m.px = m.x;
        m.py = m.y;
      }
    }
  }
  //The round particles that surplus
  for(var i = _i+1, L = particles.length;i < L;i++) {
    m = particles[i];
    m.ran += 0.0007;

    if(m.timeFlg) {
      //Value from the current position to the target
      X = (_width/2 + Math.cos(m.ran*180/Math.PI) * m.range) - m.px;
      Y = (_height/2 + Math.sin(m.ran*180/Math.PI) * m.range) - m.py;

      T = Math.sqrt(X*X + Y*Y);
      //Angle to the target from the current position
      A = Math.atan2(Y, X);
      C = Math.cos(A);
      S = Math.sin(A);

      //Movement width
      m.x = m.px + C*T*0.15;
      m.y = m.py + S*T*0.15;
      if(m.x < 1 && m.y < 1) m.timeFlg = false;

    } else {
      //Positions of the next
      m.x = _width /2 + Math.cos(m.ran*180/Math.PI) * m.range;
      m.y = _height/2 + Math.sin(m.ran*180/Math.PI) * m.range;
    }

    //Place the particle
    drawDotLine(m.x, m.y, m.px, m.py);
  //setPixel(m.x, m.y);

    m.px = m.x;
    m.py = m.y;
  }
  cc.putImageData(bit, 0, 0);
  faidout();
  count++;
  if (count === FPS*updateTime){
    count = 0;
    last = Date.now();
  }
}

//Initialization of the particle
function particle() {
  var ran = Math.random()*360*180/Math.PI;
  var range = _width/2.2 - Math.random()*16;

  this.x = 0;
  this.y = 0;
  this.px = _width/2 + (Math.cos(ran) * range);
  this.py = _height/2 + (Math.sin(ran) * range);
  this.range = range;
  this.ran = ran;
}

//Get the current time
function timeDraw() {
  var date = new Date();
  var H = (date.getHours() > 9)? date.getHours() : '0'+date.getHours();
  var M = (date.getMinutes() > 9)? date.getMinutes() : '0'+date.getMinutes();
  var S = (date.getSeconds() > 9)? date.getSeconds() : '0'+date.getSeconds();
  var timeTxt = H+':'+M+':'+S;

  return timeTxt;
}

//Mouse click event
function mouseClick() {
	return;
  if (nowDisp === CLOCK_VIEW){
    nowDisp = TEXT_VIEW;
  } else {
    nowDisp = CLOCK_VIEW;
  }
  updateState = true;
  return false;
}

//Draw a line with a dot
function drawDotLine(x, y, px, py) {
  var _x = (x > px ? 1 : -1) * (x - px);
  var _y = (y > py ? 1 : -1) * (y - py);
  var sx = (x > px) ? -1 : 1;
  var sy = (y > py) ? -1 : 1;
  var r, i;
  if (_x < 3 && _y < 3) return;
  var l,s;
  if(_x < _y){
    l = _y;
    s = _x;
    r = s/l;
    for (i = 0;i < l;i++){
      setPixel(x + sx*i*r, y+sy*i);
    }
  } else {
    l = _x;
    s = _y;
    r = s/l;
    for (i = 0;i < l;i++){
      setPixel(x + sx*i, y+sy*i*r);
    }
  }
}