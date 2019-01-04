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
var isCercle = 0;
var color;
var coordTempX;
var coordTempY;
var draw = 0;


var canv = document.getElementById('canvas');
var context = canv.getContext('2d');
var image = document.getElementById('image');
context.fillStyle = "white";
context.fillRect(0, 0, canv.width, canv.height);

//var canvasCopy = document.createElement('canvas');
var contextCopy;// = canvasCopy.getContext('2d');
//contextCopy  = context.getImageData(0, 0, canv.width, canv.height);
/* Coordonnées à utiliser pour le tampon*/
var xSelect1, ySelect1, xSelect2, ySelect2;
var isSelected = 0; //La sélection peut-être activée
var isAreaPut = 1; // * copies ont été faites 

class souris extends Button{

	constructor(content,execute){
		super(content, execute);

	}

	addListeners(){
		super.addListeners();
		this.element.addEventListener("click" , function(e){
			setPencil = setPipette = setTampon = setContourDetection = 0;	
			//console.log("setPencil = ", setPencil, "setPipette = ", setPipette, "setTampon = ", setTampon, "setContourDetection = ", setContourDetection)
		});
	}
}


class pencil extends Button{

	constructor(content, execute){
		super(content, execute);
	}
	addListeners(){
		super.addListeners();
		var self = this;
		this.element.addEventListener("mousedown", function(event){	
				event.target.style.boxShadow = '10px 10px 10px grey';
				/* Vu qu'on a activé le crayon on désactive les autres (pipette, tampon et détection
				 * de contours) pour ne pas mélanger
				*/
				setPencil = !setPencil;
				setPipette = 0;
				setTampon = 0;
				setContourDetection = 0;
				coordTempX = event.offsetX;
				coordTempY = event.offsetY;
				self.pencilDraw();

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

	drawLine(x1, y1, x2, y2){
		context.beginPath();
		context.lineJoin = "round";
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineWidth = size;
		context.strokeStyle = color;
		context.stroke();
	}

	pencilDraw(){
		//console.log("setPencil = ", setPencil);
		var self = this;

		canv.addEventListener('mousedown' ,function (e) {
			draw = 1; // met draw à 1
			coordTempX = e.offsetX;
			coordTempY = e.offsetY;
			
		});

		canv.addEventListener('mouseup' ,function (e) {
			draw = 0; // met draw à 0			
		});

		canv.addEventListener('mousemove',function (e) {
		/*console.log("draw = ", draw, "setPencil", setPencil);
		console.log("\n", color, setPencil, setPipette, setTampon, setContourDetection);	*/
			if(setPencil && draw){			
				if(isCercle){
					//context.fillStyle = color
					//A revoir 
					context.beginPath();											
					context.arc(e.offsetX, e.offsetY, size, 0, 2 * Math.PI);
					context.strokeStyle = "red";
					context.stroke();
					context.fill();
				}
				else{
					//context.fillRect( e.offsetX, e.offsetY, size, size);
					//console.log(coordTempX, coordTempY, e.offsetX, e.offsetY);
					self.drawLine(coordTempX, coordTempY, e.offsetX, e.offsetY);
					coordTempX = e.offsetX;
					coordTempY = e.offsetY;
					console.log(color, setPencil, setPipette, setTampon, setContourDetection);	
				}
			}	
		});
	
		//4requestAnimationFrame(this.pencilDraw(isCercle));

	}
	
}


class pipette extends Button{
	constructor(content, execute){
		super(content, execute);
	}

	addListeners(){
		var self = this;

		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			event.target.style.boxShadow = '10px 10px 10px grey';
			setPencil = setTampon = setContourDetection = 0;
			setPipette = !setPipette;

			self.pickColor();
		});

		this.element.addEventListener("mouseup", function(event){
			//setPipette = !setPipette;
			event.target.style.boxShadow = '0px 0px 0px grey';
		});
	}

	pickColor(){
		canv.addEventListener("click", function(e){
			if(setPipette){
				var getImgData = context.getImageData(e.offsetX, e.offsetY, 1, 1);
				var r = getImgData.data[0];
				var g = getImgData.data[1];
				var b = getImgData.data[2];
				var str = 'rgb(' + r + ',' + g + ',' + b + ')';
				color = str;
			}
		});
	}
	
}


var x1, y1, w, h;



class tampon extends Button{

	constructor(content,execute){
		super(content, execute);
	}

	addListeners(){
		var self = this;
		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			event.target.style.boxShadow = '10px 10px 10px grey';
			setPencil = 0;
			setPipette = 0;
			setTampon = !setTampon;
			setContourDetection = 0;
			self.selectArea();
						
		});

		this.element.addEventListener("mouseup", function(event){
			event.target.style.boxShadow = '0px 0px 0px grey';
		});
	}
	/* Sélection d'une zone du canvas*/
	selectArea(){

		var self = this;

		canv.addEventListener("mousedown", function(e){
			xSelect1 = e.offsetX;
			ySelect1 = e.offsetY;			  	
		}, {once: true});

		canv.addEventListener("mousemove", function(e){
				xSelect2 = e.offsetX;
				ySelect2 = e.offsetY;
		
		}, {once: true});
	
		canv.addEventListener("mouseup", function(e){
			xSelect2 = e.offsetX;
			ySelect2 = e.offsetY;

			var x2, y2;
			x1 = Math.min(xSelect1, xSelect2);
			x2 = Math.max(xSelect1, xSelect2);

			y1 = Math.min(ySelect1, ySelect2);
			y2 = Math.max(ySelect1, ySelect2);

			w = x2 - x1;
			h = y2 - y1;

			//canvasCopy = context.getImageData(x1 - 1, y1 - 1, w + 2, h + 2);
			contextCopy = context.getImageData(0, 0, canv.width, canv.height);
			context.rect(x1, y1, w, h);
			context.stroke();
			
			self.putArea();
		}, {once: true});
	}

	putArea(){			
		canv.addEventListener("mousedown", function(e){				
			//context.putImageData(canvasCopy, 0, 0);
			var partCanvasCopy = context.getImageData(x1, y1, w, h);
			context.putImageData(contextCopy, 0, 0);
			context.putImageData(partCanvasCopy, e.offsetX, e.offsetY);
			contextCopy = context.getImageData(0, 0, canv.width, canv.height);
			//context.putImageData(canvasCopy, x1 - 1, y1 - 1);

		});	
		canv.addEventListener("mouseup", function(e){				
			//contextCopy.clearRect(0, 0, canvasCopy.width, canvasCopy.height);
			console.log("Fin de la copie\nisSelected = ", isSelected, "isAreaPut = ", isAreaPut, "\n\n");
		}, {once: true});
	}

}


class ContourDetection extends Button{
	constructor(content,execute){
		super(content, execute);
		this.getCoordDone = false;
		this.pixelStack = [];
		this.seenPixels = []; //Va contenir les pixels déjà vus
		this.startColor;
	}

	addListeners(){
		super.addListeners();
		var self = this;
		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			event.target.style.boxShadow = '10px 10px 10px grey';
			setPencil = 0;
			setPipette = 0;
			setTampon = 0;
			setContourDetection = !setContourDetection;
			// On appelle la fonction de remplissage
			self.callFillArea();
						
		});

		this.element.addEventListener("mouseup", function(event){
			event.target.style.boxShadow = '0px 0px 0px grey';
		});
	}	

	isInList(subL, l){
		for(var i = 0; i < l.length; ++i)
			if(subL.toString() == l[i].toString())
				return true;
		return false;	
	}

	callFillArea(){
		var self = this;
		canv.addEventListener("click", function(e){
			xSelect1 = Math.floor(e.offsetX);
			ySelect1 = Math.floor(e.offsetY);
			self.startColor = self.pickColor(xSelect1, ySelect1);
			self.fillArea()
		});
	}
	
	fillArea(){		
		var self = this;
		var xStart, yStart;
		var dx = [0, -1, 0, 1];
		var dy = [-1, 0, 1, 0];
		//self.drawVerticalLine(25, 40, 70);
		xStart = xSelect1; yStart = ySelect1;
		self.pixelStack.push([xStart, yStart]);
		var pix, x, y, colorFound, west, est, dirX, dirY;
		console.log("Avant while\nlength = ", self.pixelStack.length);
		while(self.pixelStack.length){
			pix = self.pixelStack.pop(); // On dépile le pixel
			west = pix.slice(); est = pix.slice();
			// On va jusqu'à l'ouest
			for(; west[0] >= 0 && self.matchTheStartColor(west[0], west[1]); --west[0]);
			// On va jusqu'à l'est
			for(; est[0] <= canv.width && self.matchTheStartColor(est[0], est[1]); ++est[0]);
			for(x = west[0] + 1; x < est[0]; ++x){
				self.fillPixel(x, pix[1]);
				for(var i = 0; i < 3; i += 2){
					// Direction Nord et Sud
					if(self.matchTheStartColor(x + dx[i], pix[1] + dy[i]))
						self.pixelStack.push([x + dx[i], pix[1] + dy[i]]);						
				}	
			}
		}
		console.log("\n\nFini!!!!");
	}

	pickColor(x, y){
		//console.log("\npickColor:\tx = ", x, "\ty = ", y);
		var getImgData = context.getImageData(x, y, 1, 1);
		var r = getImgData.data[0];
		var g = getImgData.data[1];
		var b = getImgData.data[2];
		var a = getImgData.data[3];
		return [r, g, b, a];
	}

	matchTheStartColor(x, y){
		var self = this;
		var currentPixel = context.getImageData(x, y, 1, 1).data;
		return (self.startColor[0] == currentPixel[0] && self.startColor[1] == currentPixel[1] 
			&&  self.startColor[2] == currentPixel[2] && self.startColor[3] == currentPixel[3]);
	}

	fillPixel(x, y){
		context.fillStyle = color;
		context.fillRect(x, y, 1, 1);
	}


	drawLine(x1, y1, x2, y2){
		context.beginPath();
		context.lineJoin = "round";
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineWidth = size;
		context.strokeStyle = color;
		context.stroke();
	}

	drawVerticalLine(x, y1, y2){
		var yMax = Math.max(y1, y2);
		var yMin = Math.min(y1, y2);
		for(var y = yMin; y < yMax + 1; ++y)
			this.fillPixel(x, y);
	}
	
}

class undo extends Button{

	constructor(content,execute){
		super(content, execute);

	}

	addListeners(){
		super.addListeners();
		this.element.addEventListener("click" , function(e){

			/* clear la canvas*/
			/*
			context.setTransform(1, 0, 0, 1, 0, 0);	
			context.clearRect(0, 0, canv.width, canv.height);	
			*/

			loadImage(e);

		});
	}
}

function createDiv(c){
	var newDiv = document.createElement('div');
	document.body.appendChild(newDiv);
	newDiv.style.display = "inline-block";
	newDiv.style.height = "20px";
	newDiv.style.width = "20px";
	newDiv.style.background = c;

	newDiv.addEventListener('click', function(e){
		//pick color
		/* soustraire de la couleur ne newDiv uniquement où rgb est défini*/
		var str = newDiv.style.background;;
		color = str.split(" none", 1);
		console.log("color picked : ", color);
	});
}

/*
 * @param nbColors représente le nombre de valeurs
 * possibles pour chaque composante 
*/
function createPalette(nbColors){
	var newLine;
	var step = 255 / nbColors;
	for(var r = 0; r < 256; r += step){
		for(var g = 0; g < 256; g += step){
			for(var b = 0; b < 256; b += step){
				createDiv('rgb(' + r + ',' + g + ',' + b + ')');		
			}			
		}

		newLine = document.createElement('br');   
		newLine.style.clear = 'both';
		document.body.appendChild(newLine);
	}
}


function anotherClick1(){
		console.log("Oh! PENCILLLLLLLL!\n");
}

function anotherClick2(){
		console.log("Oh! PIPETTEEEEEEEEE!\n");
}

function anotherClick3(){
		console.log("Oh! Tampon!\n");
}

function anotherClick4(){
		console.log("Oh! Contour Detection!\n");
}

function main(){
	var x = 0;	
	createPalette(3);
	let btnSouris = new souris("souris", anotherClick3);
	let btnPencil = new pencil("crayon", anotherClick1);
	let btnPipette = new pipette("pipette", anotherClick2);
	let btnTampon = new tampon("tampon", anotherClick3);
	let btnContourDetection = new ContourDetection("détection de contour",anotherClick4);
	let btnUndo = new undo("undo", anotherClick3);
}