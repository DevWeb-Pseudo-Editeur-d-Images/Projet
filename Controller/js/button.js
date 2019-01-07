window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                                window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


onload = main;

/* Classe Button: permet de créer un bouton 
 * basique qui lors du click entoure le bouton
 * d'une ombre
*/
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
	}

	addListeners(){
		this.element.addEventListener("mousedown", function(event){ 						
				event.target.style.boxShadow = '10px 10px 10px grey'; });

		this.element.addEventListener("mouseup", function(event){ 						
				event.target.style.boxShadow = '0px 0px 0px grey'; });			
	}
}

/* Variables globales indiquant 
 * l'activation d'un bouton précis
 * Par défault, ils sont tous mis à 'false'
*/
var setPencil = false; // Variable indiquant l'activation du bouton 'crayon'
var setColorPicker = false; // Variable indiquant l'activation du bouton 'pipette'
var setClone = false; // Variable indiquant l'activation du bouton 'tampon'
var setBucketFill = false; // Variable indiquant l'activation du bouton 'pot de peinture'
var color = [0, 0, 0, 0]; // couleur par défaut
var size = 1;	// taille de la pointe du crayon
var isCercle = false; // forme de la pointe du crayon

/* Classe pencil (crayon): permet de créer l'outil crayon
 * En se servant de certaines fonctionnalités 
 * de la classe 'Button'
*/

class pencil extends Button{

	/* @constructor: le constructor de la classe pencil 
	 * @param content: représente le titre du bouton
	 * @param execute: La méthode à éxécuter lors du click sur le bouton
	*/
	constructor(content, execute){
		super(content, execute);
		this.draw = false;
		this.coordTempX;
		this.coordTempY;
	}

	/* @addListeners: permet d'appeler la fonction qui a comme tâche le dessin	
	 * Ne renvoie rien
	*/
	addListeners(){
		super.addListeners();
		var self = this;
		this.element.addEventListener("mousedown", function(event){	
				/* Etant donné l'activation de l'outil 'crayon'
				 * La désactivation des autres outils est évidente
				 * (pipette, tampon et pot de peinture) pour ne pas mélanger
				*/
				setPencil = true;
				setColorPicker = setClone = setBucketFill = false;
				/* On appelle la méthode 'pencilDraw()'
				 * pour effectuer la tâche du dessin
				*/	
				self.pencilDraw();

		});			
	}

	/* @drawLine: permet de tracer une ligne entre deux points
	 * @param x1: représente l'abscisse du point de départ
	 * @param y1: représente l'ordonnée du point de départ
	 * @param x1: représente l'abscisse du point d'arrivée
	 * @param x1: représente l'ordonnée du point d'arrivée
	 * Ne renvoie rien
	*/
	drawLine(x1, y1, x2, y2){
		context.beginPath();
		context.lineJoin = "round";
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		context.lineWidth = size;
		var c = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
		context.strokeStyle = c;
		context.stroke();
	}

	/* @pencilDraw: méthode principale reflétant l'utilité de l'outil 'crayon'
	 * Ne renvoie rien
	*/
	pencilDraw(){
		var self = this;
		var c; // représentera la couleur à prendre
		/* Lors d'un enfoncement du bouton gauche de la souris
		 * On récupère les coordonnées du click 
		 * et on met draw à 'true' pour pouvoir dessiner
		*/
		canv.addEventListener('mousedown' ,function (e) {
			self.coordTempX = e.offsetX;
			self.coordTempY = e.offsetY;
			self.draw = true; 
		});
		
		/* Lors du relâchement du bouton gauche de la souris
		 * on met draw à 'false' pour désactiver la fonction dessin
		*/
		canv.addEventListener('mouseup' ,function (e) {
			self.draw = false; 			
		});

		/* Lors du mouvement de la souris au travers le canvas
		 * Si les conditions sont remplies (SetPencil et draw à 'true')
		 * On dessine infiniment
		*/
		canv.addEventListener('mousemove',function (e) {
			if(setPencil && self.draw){			
				if(isCercle){
					//A revoir 
					context.beginPath();											
					context.arc(e.offsetX, e.offsetY, size, 0, 2 * Math.PI);
					c = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
					context.fillStyle = c;
					context.stroke();
					context.fill();
				}
				else{
					self.drawLine(self.coordTempX, self.coordTempY, e.offsetX, e.offsetY);
					self.coordTempX = e.offsetX;
					self.coordTempY = e.offsetY;	
				}
			}	
		});
	}	
}


/* Classe colorPicker: permet de créer l'outil pipette
 * En se servant de certaines fonctionnalités 
 * de la classe 'Button'
*/

class colorPicker extends Button{
	/* @constructor: le constructor de la classe colorPicker
	 * @param content: représente le titre du bouton
	 * @param execute: La méthode à éxécuter lors du click sur le bouton
	*/
	constructor(content, execute){
		super(content, execute);
	}

	/* @addListeners: permet d'appeler la fonction qui se charge d'extraire la couleur à un endroit précis	
	 * Ne renvoie rien
	*/
	addListeners(){
		var self = this;

		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			// On désactive les outils mis à part la pipette
			setPencil = setClone = setBucketFill = false;
			setColorPicker = true;
			// On appelle la méthode 'pickColor' pour extraire la couleur
			self.pickColor();
		});
	}

	/* @pickColor: méthode principale pour extraire une couleur 
	 * et met dans 'color', la couleur extraite
	 * Ne renvoie rien
	*/
	pickColor(){
		canv.addEventListener("click", function(e){
			if(setColorPicker){
				var getImgData = context.getImageData(e.offsetX, e.offsetY, 1, 1);
				var r = getImgData.data[0];
				var g = getImgData.data[1];
				var b = getImgData.data[2];
				var a = getImgData.data[3];
				canv.style.borderColor = 'rgb(' + r + ',' + g + ',' + b + ')';
				color = [r, g, b, a];//str;
			}
		});
	}
	
}

/* Classe clone: permet de créer l'outil tampon
 * En se servant de certaines fonctionnalités 
 * de la classe 'Button'
*/
class clone extends Button{

	/* @constructor: le constructor de la classe pipette
	 * @param content: représente le titre du bouton
	 * @param execute: La méthode à éxécuter lors du click sur le bouton
	*/
	constructor(content,execute){
		super(content, execute);
		this.selectx1 = 0;
		this.selecty1 = 0;
		this.selectx2 = 0;
		this.selecty2 = 0;
		this.contextCopy;
		this.xStart = 0;
		this.yStart = 0;
		this.w = 0;
		this.h = 0;
	}

	/* @addListeners: permet d'appeler la fonction qui se charge de clôner une zone du canvas	
	 * Ne renvoie rien
	*/
	addListeners(){
		var self = this;
		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			// On désactive les outils mis à part le tampon
			setPencil = setColorPicker = setBucketFill = false;
			setClone = true;
			// Appel de la méthode 'selectArea' pour sélectionner une zone de l'image
			self.selectArea();
						
		});

	}

	/* @selectArea: permet la sélection d'une zone du canvas à l'endroit cliqué
	 * Ne renvoie rien
	*/
	selectArea(){
		var self = this;
		var  x2, y2;
		/* Lors d'un enfoncement du bouton gauche de la souris
		 * On récupère les coordonnées du click 
		*/
		canv.addEventListener("mousedown", function(e){
			self.selectx1 = e.offsetX;
			self.selecty1 = e.offsetY;			  	
		}, {once: true});

		/* Lors du mouvement de la souris au travers le canvas
		 * On récupère continuellement les coordonnées de la souris
		*/
		canv.addEventListener("mousemove", function(e){
			self.selectx2 = e.offsetX;
			self.selecty2 = e.offsetY;		
		}, {once: true});
	
		/* Lors du relâchement du bouton gauche de la souris
		 * on récupère les dernières coordonnées du mouvement de la souris
		 * et on dessine un rectangle représentant la zone sélectionnée
		*/
		canv.addEventListener("mouseup", function(e){
			self.selectx2 = e.offsetX;
			self.selecty2 = e.offsetY;

			self.xStart = Math.min(self.selectx1, self.selectx2);
			x2 = Math.max(self.selectx1, self.selectx2);

			self.yStart = Math.min(self.selecty1, self.selecty2);
			y2 = Math.max(self.selecty1, self.selecty2);

			self.w = x2 - self.xStart;
			self.h = y2 - self.yStart;

			self.contextCopy = context.getImageData(0, 0, canv.width, canv.height);
			context.rect(self.xStart, self.yStart, self.w, self.h);
			var prevSize = size;
			size = 0.2;
			context.stroke();
			size = prevSize;
			// Appel de la fonction 'putArea' pour clôner la zone sélectionnée
			self.putArea();
		}, {once: true});
	}

	/* @putArea: permet le clônage d'une zone préalablement sélectionnée du canvas à l'endroit cliqué
	 * Ne renvoie rien
	*/
	putArea(){			
		var self = this;
		canv.addEventListener("mousedown", function(e){	
			var partCanvasCopy = context.getImageData(self.xStart, self.yStart, self.w, self.h);
			context.putImageData(self.contextCopy, 0, 0);
			context.putImageData(partCanvasCopy, e.offsetX, e.offsetY);
			self.contextCopy = context.getImageData(0, 0, canv.width, canv.height);

		});
	}

}

/* Classe bucketFill: permet de créer l'outil pot de peinture
 * En se servant de certaines fonctionnalités 
 * de la classe 'Button'
*/
class bucketFill extends Button{

	/* @constructor: le constructor de la classe pot de peinture
	 * @param content: représente le titre du bouton
	 * @param execute: La méthode à éxécuter lors du click sur le bouton
	*/
	constructor(content,execute){
		super(content, execute);
		this.getCoordDone = false;
		this.pixelStack = []; // Pile qui stockera les pixels à explorer
		this.seenPixels = []; //Va contenir les pixels déjà vus
		this.startColor;
		this.xStart = 0;
		this.yStart = 0;
	}

	/* @addListeners: permet d'appeler la fonction qui se charge de remplir une zone du canvas d'une couleur	
	 * Ne renvoie rien
	*/
	addListeners(){
		super.addListeners();
		var self = this;
		super.addListeners();
		this.element.addEventListener("mousedown", function(event){
			// On désactive les outils mis à part le pot de peinture
			setPencil = setColorPicker = setClone = false;
			setBucketFill = true;
			// Appel de la fonction qui appelera la fonction de remplissage
			self.callFillArea();
						
		});
	}	

	/* @callFillArea: permet, lors du click sur le canvas, d'appeler la fonction de remplissage 
	 * Ne retourne rien	
	*/
	callFillArea(){
		var self = this;
		canv.addEventListener("click", function(e){
			self.xStart = Math.floor(e.offsetX);
			self.yStart = Math.floor(e.offsetY);
			self.startColor = self.pickColor(self.xStart, self.yStart);
			self.fillArea()
		});
	}
	
	/* @fillArea: méthode principale de la classe car elle se charge du remplissage d'une zone du canvas
	 * Cette méthode est très inspirée de l'algorithme présent sur Wikipédia 
	 * lien: https://fr.wikipedia.org/wiki/Algorithme_de_remplissage_par_diffusion#Optimisations
	 * Ne renvoie rien
	*/
	fillArea(){		
		var self = this;
		var pix, x, y, colorFound, west, est, dirX, dirY;
		var copy = context.getImageData(0, 0, canv.width, canv.height);
		var dataCopy = copy.data;
		/* Tableaux des directions en abscisse et en ordonnée
		 * en suivant NOSE (Nord, Ouest, Sud, Est)
		*/ 
		var dx = [0, -1, 0, 1]; 
		var dy = [-1, 0, 1, 0];	
		// On empile le pixel de départ dans la pile
		self.pixelStack.push([self.xStart, self.yStart]);
		console.log("Avant while\nlength = ", self.pixelStack.length);
		while(self.pixelStack.length){
			pix = self.pixelStack.pop(); // On dépile le pixel à explorer
			// 'west' et 'est' seront initialisées au pixel de départ
			west = [pix[0], pix[1]]; est = [pix[0], pix[1]];
			// On va jusqu'à l'ouest
			for(; west[0] >= 0 && self.matchTheStartColor(dataCopy, west[0], west[1]); --west[0]);
			// On va jusqu'à l'est
			for(; est[0] <= canv.width && self.matchTheStartColor(dataCopy, est[0], est[1]); ++est[0])
			for(x = west[0] + 1, y = pix[1]; x < est[0]; ++x){
				self.fillPixel(dataCopy, x, y); // Appel de la méthode qui remplit un pixel de 'color'
				for(var i = 0; i < 3; i += 2){
					dirX = x + dx[i];
					dirY = y + dy[i];
					/* On empilera tous les pixels qui sont au nord et au sud
					 * qui possèdent la même couleur que le pixel de départ 
					*/	
					if(self.matchTheStartColor(dataCopy, dirX, dirY))
						self.pixelStack.push([dirX, dirY]);						
				}	
			}
		}
		// On met dans 'context' sa copie ainsi modifiée
		context.putImageData(copy, 0, 0);
		console.log("\n\nFini!!!!");
	}

	/* @fillPixel: remplit un pixel de la couleur choisie
	 * @param data: représente un tableau monodimensionnel contenant les données brutes des pixels dans l'ordre RGBA
	 * @param x: la coordonnée en abscisse du pixel
	 * @param y: la coordonnée en ordonnée du pixel
	 * Ne retourne rien
	*/
	fillPixel(data, x, y){
		data[(y * canv.width + x) * 4]     = color[0];
		data[(y * canv.width + x) * 4 + 1] = color[1];
		data[(y * canv.width + x) * 4 + 2] = color[2];
		data[(y * canv.width + x) * 4 + 3] = color[3];
	}

	/* @pickColor: extrait la couleur du pixel sélectionné
	 * @param x: la coordonnée en abscisse du pixel
	 * @param y: la coordonnée en ordonnée du pixel
	 * Retourne la couleur sous forme de tableau
	*/
	pickColor(x, y){
		var getImgData = context.getImageData(x, y, 1, 1);
		var data = getImgData.data;
		return [data[0], data[1], data[2], data[3]];
	}

	/* @matchTheStartColor: vérifie si le pixel de départ et celui sélectionné ont la même couleur
	 * @param data: représente un tableau monodimensionnel contenant les données brutes des pixels dans l'ordre RGBA
	 * @param x: la coordonnée en abscisse du pixel
	 * @param y: la coordonnée en ordonnée du pixel
	 * Retourne 'true' dans le cas où leurs couleurs sont équivalentes, 'false' sinon 
	*/
	matchTheStartColor(data, x, y){	
		var self = this;
		var pos = (y * canv.width + x) * 4;
		return (self.startColor[0] == data[pos] && self.startColor[1] == data[pos +1] 
			&&  self.startColor[2] == data[pos + 2] && self.startColor[3] == data[pos + 3]);
	}

}


/* Classe undo: permet d'effacer la canvas
 * En se servant de certaines fonctionnalités 
 * de la classe 'Button'
*/
class undo extends Button{

	/* @constructor: le constructor de la classe pot de peinture
	 * @param content: représente le titre du bouton
	 * @param execute: La méthode à éxécuter lors du click sur le bouton
	*/
	constructor(content,execute){
		super(content, execute);

	}

	/* @addListeners: permet d'appeler la fonction qui se charge de vider le canvas	
	 * Ne renvoie rien
	*/
	addListeners(){
		super.addListeners();
		this.element.addEventListener("click" , function(e){			
			context.setTransform(1, 0, 0, 1, 0, 0);	
			context.clearRect(0, 0, canv.width, canv.height);	
			loadImage(e);
		});
	}
}


/* @createDiv: permet de créer l'élément HTML 'div'
 * @c: couleur que prendra la div
*/
function createDiv(c){
	var newDiv = document.createElement('div');
	document.body.appendChild(newDiv);
	newDiv.style.display = "inline-block";
	newDiv.style.height = "20px";
	newDiv.style.width = "20px";
	newDiv.style.background = c;
	/* Lor du click sur la div, on met dans 'color' 
	 *la couleur présente dans ceette div 
	 */
	newDiv.addEventListener('click', function(e){
		/* comme le format de 'newDiv.style.background' et de 'color' est différent
		 * On extrait la valeur de chaque composante
		 * pour ensuite les placer dans 'color'  
		*/
		var str = newDiv.style.background;
		// On se débarasse de 'none repeat scroll 0% 0%' présent dans 'str'
		var rgb = str.replace('none repeat scroll 0% 0%', '');
		// On met les bordures du canvas avec la couleur sélectionnée
		canv.style.borderColor = rgb;
		/* On extrait les nombres représentant la valeur de chaque composante 
		 * et on convertit en entier 	
		*/
		rgb = rgb.match(/\d+/g).map(function(item) { return parseInt(item, 10); });
		/* Comme rgb contient que les 3 composantes (RGB),
		 * on lui rajoute la valeur '255' pour la transparence
		*/
		color = rgb.concat([255]);
	});
}

/* @createPalette: permet de créer une palette de couleurs
 * @param nbColors représente le nombre de valeurs possibles pour chaque composante 
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

/* @updateSize: sert à mettre à jour la taille de la pointe
 * @select: l'élément avec lequel on extrait la taille
 * Ne retourne rien
*/
function updateSize(select) {
	size = select.options[select.selectedIndex].value;
}

/* @updateTypePencil: sert à mettre à jour le type de pointe du crayon(carré ou cercle)
 * @select: l'élément avec lequel on extrait le type
 * Ne retourne rien
*/
function updateTypePencil(sel) {
	var val = sel.options[sel.selectedIndex].value;
	if(val == 1)
		isCercle = true;
	else
		isCercle = false;
	console.log("isCercle = ", val, isCercle);

}

/* @clickPencil: sert à afficher un message indiquant la sélection de l'outil 'crayon'
 * Ne retourne rien
*/
function clickPencil(){
		console.log("Vous avez sélectionné l'outil 'crayon'\n");
}

/* @clickColorPicker: sert à afficher un message indiquant la sélection de l'outil 'pipette'
 * Ne retourne rien
*/
function clickColorPicker(){
		console.log("Vous avez sélectionné l'outil 'pipette'\n");
}

/* @clickClone: sert à afficher un message indiquant la sélection de l'outil 'tampon'
 * Ne retourne rien
*/
function clickClone(){
		console.log("Vous avez sélectionné l'outil 'tampon'\n");
}

/* @clickBucketFill: sert à afficher un message indiquant la sélection de l'outil 'pot de peinture'
 * Ne retourne rien
*/
function clickBucketFill(){
		console.log("Vous avez sélectionné l'outil 'pot de peinture'\n");
}

/* @clickUndo: sert à afficher un message indiquant la sélection de l'outil 'undo'
 * Ne retourne rien
*/
function clickUndo(){
		console.log("Vous avez choisi de vider le canvas\n");
}


function main(){
	// On initialise un canvas
	var canv = document.getElementById('canvas');
	var context = canv.getContext('2d');
	var image = document.getElementById('image');
	// On le remplit de la couleur blanche
	context.fillStyle = "white";
	context.fillRect(0, 0, canv.width, canv.height);
	// On crée une palette
	createPalette(3);
	// On crée un bouton pour chaque outils
	let btnPencil = new pencil("crayon", clickPencil);
	let btnColorPicker = new colorPicker("pipette", clickColorPicker);
	let btnClone = new clone("tampon", clickClone);
	let btnBucketFill = new bucketFill("pot de peinture",clickBucketFill);
	let btnUndo = new undo("undo", clickUndo);
}
