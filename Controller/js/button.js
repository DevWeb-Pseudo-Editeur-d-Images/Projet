window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


onload = main;

class Button{
	
	constructor(content, execute){
		this.element = document.createElement('div');
		document.body.appendChild(this.element);
		this.element.appendChild(document.createTextNode(content));	
		this.element.style.display = "inline-block";
		this.element.style.height = "20px";
		this.element.style.margin = "50px";
		this.element.style.background = '#EEEEEE';
		this.element.style.textAlign = "center";
		this.addListeners();
		this.element.addEventListener("click",execute);
		this.element.src = '../../images/sky.jpeg';
	}

	addListeners(){
		this.element.addEventListener("click", function(){ console.log("Click : Hello World!"); });	
	}
	
	getCoordX(){
		return this.element.offsetX;
	}

	getCoordY(){
		return this.element.offsetY;
	}

}

var setPencil = 0;
var setPipette = 0;
var setTampon = 0;
var setContourDetection = 0;
var size = 5;
var isCercle = 1;
var color;

var canv = document.getElementById('canvas');
var context = canv.getContext('2d');
var image = document.getElementById('image');

class pencil extends Button{

	constructor(content, execute){
		super(content, execute);
	}
	addListeners(){
		super.addListeners();
		var self = this;
		this.element.addEventListener("mousedown", function(event){	
				event.target.style.boxShadow = '10px 10px 10px grey';
				setPencil = 1;
				setPipette = 0;
				setTampon = 0;
				setContourDetection = 0;
				self.pencilDraw(isCercle);
				//un putPixel(x,y)	
		});	
		this.element.addEventListener("mouseup", function(event){
				event.target.style.boxShadow = '0px 0px 0px grey';});		
	}

	getCoordX(){
		super.getCoordX();
	}

	getCoordY(){
		super.getCoordY();
	}

	pencilDraw(isCercle){

		$('#canvas').on('click',function (e) {
								if(isCercle){
									//context.fillStyle = color
									context.beginPath();
									context.arc(e.offsetX, e.offsetY, size, 0, 2 * Math.PI);
									context.stroke();
									context.fill();
								}
								else
	    							context.fillRect( e.offsetX, e.offsetY, size, size);
						});
		requestAnimationFrame(this.pencilDraw(isCercle));
	}
	
}


class PushButton extends Button{
	constructor(content, execute){
		super(content, execute);
	}

	addListeners(){
		super.addListeners();
		this.element.addEventListener("mousedown", function(event){	console.log("Mouse pressed!\n");
																	event.target.style.boxShadow = '10px 10px 10px lightblue inset';});	
		this.element.addEventListener("mouseup", function(event){console.log("Mouse released!\n");
																	event.target.style.boxShadow = '0px 0px 0px';});		
	}
	
}



class HoverPushButton extends Button{

	constructor(content,execute){
		super(content, execute);

	}

	addListeners(){
		super.addListeners();
		this.element.addEventListener("mouseover", function(event){event.target.style.boxShadow = '10px 10px 10px red';});	
		this.element.addEventListener("mouseleave", function(event){event.target.style.boxShadow = '0px 0px 0px';});		
		this.element.addEventListener("mousedown", function(event){event.target.style.boxShadow = '10px 10px 10px red inset';});
		this.element.addEventListener("mouseup", function(event){event.target.style.boxShadow = '0px 0px 0px';});

	}
}


function anotherClick(){
		console.log("Oh! You've clicked again!\n");
}

function main(){
	var x = 0;	
	let btnPencil = new pencil("crayon", anotherClick);
	let btnPipette = new pencil("pipette", anotherClick);
	let btnTampon = new pencil("tampon", anotherClick);
	let btnContourDetection = new pencil("détection de contour",anotherClick);
}