var canvas = document.getElementById('topcanvas');
var xscore= document.getElementById('score');

var cv  = canvas.getContext('2d');
var mouse = { x:undefined, y:undefined }
var position = { pos: undefined };
var ball_pos = {x:undefined, y:undefined}


 



var objs=[];
init();

var scr = new Score(60,60,'yellow',30);

scr.draw();
function init(){	
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvas.style.backgroundColor = "rgba(255, 255, 255, 0.0)";;
//
window.addEventListener("mousemove" , function(event){	mouse.y  = event.y;});

window.addEventListener("resize", function(){
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});
   
}
objs.push(new Plyr_bar(20, "white"));
objs.push(new Plyr_bar( canvas.width-200 ,"red"));
objs.push(new Ball(20, 10, 10, "white"));

function Score(x_pos, y_pos, color , font_size){
        this.x_pos = x_pos;
        this.y_pos = y_pos;
        this.color = color;
        this.scr_num = 0;
        this.font_size = font_size;
        this.offset = 0;
        xscore.style.font = "bold "+ this.font_size+"px verdana, sans-serif ";
        xscore.style.color = this.color;
        xscore.style.left = this.x_pos+'px';
        xscore.style.top = this.y_pos+'px';

        this.draw = function(){
            xscore.innerHTML = 'Score: ' + this.scr_num ;
            fadeIn(xscore);
        }
        this.update = function( scr_num ){
            //this.scr_num += scr_num;
            this.draw();
        }
        
}



function Ball(radius, speed_x, speed_y, color ){
	this.radius= radius;
	this.speed_x = speed_x;
	this.speed_y = speed_y;
	this.color = color;
	this.x_pos = (window.innerWidth /2)-(this.radius/2);
	this.y_pos = (window.innerHeight /2)-(this.radius/2);
	
	this.draw = function(){
		
		cv.beginPath();
		cv.arc(this.x_pos+=this.speed_x ,this.y_pos+=this.speed_y, this.radius,0, Math.PI*2, false);
		cv.fillStyle = color;
		cv.fill();
		cv.strokeStyle = color;
		cv.stroke();
	}
	this.update= function (){
		 if (this.hit_bar()){
			this.speed_x= -this.speed_x;
			scr.update(1);
		 }
		else if(this.x_pos+this.radius <=0){
			//alert((objs[0].y_pos+ " and "+ (objs[0].y_pos+(objs[0].height))));
			this.speed_x= -this.speed_x;
			scr.update(-5);
		 }
		if(this.x_pos+this.radius > innerWidth ){// || this.x_pos-this.radius < 0){
			this.speed_x=-this.speed_x;
		}
		if(this.y_pos+this.radius > innerHeight  || this.y_pos-this.radius-scr.offset < 0 ){
			this.speed_y=-this.speed_y;
		}
		
		this.draw();
	}
	this.hit_bar= function() {
		hit = false;
		
		for (var i =0; i<2; ++i){
				if (!hit){
				hit = 	between((this.x_pos+this.radius)-objs[i].width, (objs[i].x_pos-(objs[i].width/2)),(objs[i].x_pos+(objs[i].width/2))) && (
						between((this.y_pos+this.radius), objs[i].y_pos,(objs[i].y_pos+(objs[i].height))) ||
						between((this.y_pos-this.radius), objs[i].y_pos,(objs[i].y_pos+(objs[i].height))) );
				}
		}
		return hit;
	}
}

function between(a,x,y){
	return ((x<a) && (a< y));
}
function get_distance(x,y,x1,y1){
	return Math.sqrt(Math.pow(x1-x,2)+Math.pow(y1-y,2));
}

function Plyr_bar(x_pos, color, position){
	this.width = 50;
	this.height= 200;
	this.x_pos = x_pos;
	this.y_pos = (window.innerHeight /2)-(this.height/2);
	this.color = color;
	
	this.draw  = function (){
		cv.fillStyle = this.color;
		cv.fillRect(this.x_pos,this.y_pos,this.width,this.height); 
		cv.stroke();
	}
	this.update = function(y){
		if(this.is_in()){
			this.y_pos = mouse.y -(this.height/2);
		}
		this.draw();
	}
	this.setpos_update = function (y){
		this.y_pos = y-(this.height/2);
		this.draw();
	}
	this.is_in = function(){
		return ( 	mouse.y -(this.height/2) >= 0+scr.offset &&
					mouse.y +(this.height/2) <= window.innerHeight
		);		
	}
}


function fadeIn(el) {
 //from http://jsfiddle.net/TH2dn/2/
    
    el.style.opacity = 0;


  var tick = function() {
    el.style.opacity = +el.style.opacity + 0.01;


    if (+el.style.opacity < 1) {
      (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
    }
  };

  tick();
}

function pong(){
	requestAnimationFrame(pong);
	cv.clearRect(0,scr.offset,innerWidth, innerHeight-scr.offset);
    objs[0].update();
	objs[2].update();
	objs[1].setpos_update(objs[2].y_pos);
}
pong();
