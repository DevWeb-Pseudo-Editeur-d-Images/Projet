
var canv = document.getElementById('canvas');
var context = canv.getContext('2d');
var image = document.getElementById('image');	
image.addEventListener('change', loadImage);
var im = new Image;	

var pathImage;  


function loadImage(event) {	
	pathImage = event.target.files[0];
	/*var path  = pathImage
	module.exports.pathImage = event.target.files[0];*/
	im.src = URL.createObjectURL(pathImage);	
	im.onload = function(){
		context.drawImage(im, 0, 0, canvas.width, canvas.height);
	}
}	

var inputSatur = document.getElementById('satur');
var inputLum = document.getElementById('lum');
var inputContr = document.getElementById('contr');

	
inputContr.oninput = function() {
	var output = document.getElementById('contrPar');
	output.innerHTML = this.value;
	
}


inputLum.oninput = function() {
	var output = document.getElementById('lumPar');
	output.innerHTML = this.value;	
	
}

inputSatur.oninput = function() {
	var output = document.getElementById('saturPar');
	output.innerHTML = this.value;
}


inputContr.addEventListener('input', function() {
	context.filter = 'brightness(' + inputLum.value + '%) contrast(' + this.value + '%) saturate(' + inputSatur.value + '%)';
	context.drawImage(im, 0, 0, canvas.width, canvas.height);
});



inputLum.addEventListener('input', function() {
	context.filter = 'brightness(' + this.value + '%) contrast(' + inputContr.value + '%) saturate(' + inputSatur.value + '%)';
	context.drawImage(im, 0, 0, canvas.width, canvas.height);
});

inputSatur.addEventListener('input', function() {
	context.filter = 'brightness(' + inputLum.value + '%) contrast(' + inputContr.value + '%) saturate(' + this.value + '%)';
	context.drawImage(im, 0, 0, canvas.width, canvas.height);
});