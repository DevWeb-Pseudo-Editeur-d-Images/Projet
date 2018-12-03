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
				//console.log("getImgData = ", getImgData);
				var r = getImgData.data[0];
				var g = getImgData.data[1];
				var b = getImgData.data[2];
				var str = 'rgb(' + r + ',' + g + ',' + b + ')';
				color = str;
				//console.log(color, r, g, b);

				//console.log(color, setPencil, setPipette, setTampon, setContourDetection);
			}
		});
	}
	
}



class tampon extends Button{

	constructor(content,execute){
		super(content, execute);

	}

	addListeners(){
		var self = this;
		super.addListeners();
		this.element.addEventListener("mousedown", function(){
			self.frameLoop();
		});
	/* Dupplication  d'une zone d'images*/

	}

	selectArea(){
		canv.addEventListener("mousedown", function(e){
			xSelect1 = e.offsetX;
			ySelect1 = e.offsetY;			  
		});

		canv.addEventListener("mousemove", function(e){
			console.log("SelectArea : MouseMove \nisSelected = ", isSelected, "isAreaPut = ", isAreaPut, "\n\n");
			if(isSelected == 0 && isAreaPut == 1){
				var x1, x2, y1, y2, w, h;
				xSelect2 = e.offsetX;
				ySelect2 = e.offsetY;
				x1 = Math.min(xSelect1, xSelect2);
				x2 = Math.max(xSelect1, xSelect2);

				y1 = Math.min(ySelect1, ySelect2);
				y2 = Math.max(ySelect1, ySelect2);

				w = x2 - x1;
				h = y2 - y1;

				context.rect(x1, y1, w, h);
				context.stroke();
			}	
		});


		canv.addEventListener("mouseup", function(e){
			xSelect2 = e.offsetX;
			ySelect2 = e.offsetY;
			isSelected = 1;
			isAreaPut = 0;
			console.log("Fin de la sélection\nisSelected = ", isSelected, "isAreaPut = ", isAreaPut, "\n\n");
		});
	}

	putArea(){
		canv.addEventListener("mousedown", function(e){
			//Copie de la zone ici
			//isAreaPut = 1; //Entrain de dessiner
			if(isSelected == 1 && isAreaPut == 0)
				console.log("Entrain de dessiner\n");
		});
		canv.addEventListener("mouseup", function(e){
			isAreaPut = 1; //On désactive la copie
			isSelected = 0; // sélection activée
			console.log("Fin de la copie\nisSelected = ", isSelected, "isAreaPut = ", isAreaPut, "\n\n");
		});
		
		//console.log("isSelected = ", isSelected);
	}

	frameLoop(){
		//if(isSelected == 0 && isAreaPut == 1){			
			//console.log("selectArea\nisSelected = ", isSelected, "\nisAreaPut = ", isAreaPut, "\n\n");
			this.selectArea();
		//}
		//else if (isSelected == 1 && isAreaPut == 0){
			//console.log("putArea\nisSelected = ", isSelected, "\nisAreaPut = ", isAreaPut, "\n\n");
			this.putArea();
		//}
		//requestAnimationFrame(frameLoop);
	}
}



class ContourDetection extends Button{

	constructor(content,execute){
		super(content, execute);

	}

	addListeners(){
		super.addListeners();
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