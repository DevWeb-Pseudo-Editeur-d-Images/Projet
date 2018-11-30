var MIN = 50;
var MAX = 151; // (200 - Min + 1)
var NB_COMPONENTS = 256;

function createOneDiv(w, h, r, l, bgColor){
	var newDiv = document.createElement('div');
	document.body.appendChild(newDiv);
	newDiv.style.display = "inline-block";
	newDiv.style.height = h;
	newDiv.style.width = w;
	newDiv.style.left = l;
	newDiv.style.right = r;
	newDiv.style.background = bgColor;
}



function CreateManyDivs(nbDivs){
	var width, height, right, left, r, g, b, color;
	for(var i = 0; i < nbDivs; ++i){
		width = MIN + math.random() * MAX;
		height = MIN + math.random() * MAX;
		right = math.random() * innerWidth;
		left = math.random() * innerHeight;
		r = math.random() * NB_COMPONENTS;
		g = math.random() * NB_COMPONENTS;
		b = math.random() * NB_COMPONENTS;
		color = "rgb("+r+","+g+","+b+")";
		createOneDiv(width, height, right, left, color)

	}

}