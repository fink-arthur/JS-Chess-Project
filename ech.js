var masqueClique = false;
var compteTour = 0;

function imagePiece(piece){ //fonction donne le lien pour l'image correspondant a la piece
	switch(piece){
		case 'K':
			return 'wK.png';
			break;
		case 'Q':
			return 'wQ.png';
			break;
		case 'R':
			return 'wR.png';
			break;
		case 'B':
			return 'wB.png';
			break;
		case 'N':
			return 'wN.png';
			break;
		case 'P':
			return 'wP.png';
			break;
		case 'k':
			return 'bK.png';
			break;
		case 'q':
			return 'bQ.png';
			break;
		case 'r':
			return 'bR.png';
			break;
		case 'b':
			return 'bB.png';
			break;
		case 'n':
			return 'bN.png';
			break;
		case 'p':
			return 'bP.png';
			break;
		default:
			return 'empty.png';
			break;
	}
	}

function afficher(){ //affiche l(echiquier en utilisant la variable FEN qui stocke l'etat de l'echiquier
	var echiquierHTML = document.getElementById("echiquier");
	echiquierHTML.innerHTML = "";
	var FENarray = FEN.split("/");
	for(row = 0; row<8; row++)
	{
		var i = 0;
		var j = 0;
	 	tr = document.createElement("TR");
		tr.style.height = "3em";
		for(col = 0; col<8; col++)
		{
			if (((FENarray[row][j] === '1') || (FENarray[row][j] === '2') ||(FENarray[row][j] === '3') ||(FENarray[row][j] === '4') ||(FENarray[row][j] === '5') ||(FENarray[row][j] === '6') ||(FENarray[row][j] === '7') ||(FENarray[row][j] === '8')) && (i == 0)){
				i = FENarray[row][j];
				}
			td = document.createElement("TD");
			td.setAttribute("onclick", "cliqueCase(" + row + "," + col + ")");
			td.style.width = "3em";
			td.style.textAlign = "center";
			td.height = '80px';
			td.width = '80px';
			if (i == 0)
			{
				if (FENarray[row][j] == FENarray[row][j].toUpperCase()) {
					var couleur = "white";
					}
				if (FENarray[row][j] == FENarray[row][j].toLowerCase()){
					var couleur = "black";
					}
				td.style = "width: 3em; text-align: center; font-family: sans-serif; color: " + couleur;
				var image = document.createElement("IMG");
				image.src = imagePiece(FENarray[row][j]);
				td.appendChild(image);
				td.setAttribute("draggable", "true");
				td.setAttribute("ondragstart", "drag(event)");
			}
			else {
				td.appendChild(document.createTextNode(" "));
				}
				
			td.style.backgroundColor = (row + col)%2 == 0 ? "white" : "brown";
			tr.appendChild(td);
			if (i == 0){
				j++;
				}
			else{
				if(i == 1){
					j++;
					i--;
					}
				else{
					i--;
					}
				}
				}
		echiquierHTML.appendChild(tr);
		document.getElementById("tour").innerHTML = (compteTour % 2 == 0) ? "Blanc" : "Noir";
	}
	}

function pieceposition(i,j){ // donne la piece se trouvant a la position i j
	var FENarray = 	FEN.split("/");
	FENarray = FENarray[i];
	var ind = 0;
	var point = 0;
	while(ind < j){
		if (isNaN(FENarray[point])){
			ind++;
			}
		else{
			ind = ind + parseInt(FENarray[point]);
			}
		point++;
		}
	if (j == ind){
		if(isNaN(FENarray[point])){
			return FENarray[point];
			}
		else{
			return undefined;
			}
		}
	else{
		return undefined;
		}
	}
	
function cliqueCase(i, j){ //affiche les mouvements possible pour la piece en position i,j si celle ci existe
	afficher();
	var piece = pieceposition(i,j);
	if(piece != undefined)
	{
		if((piece == piece.toUpperCase())==(document.getElementById("tour").innerHTML == 'Blanc'))
		{
			var echiquierHTML = document.getElementById("echiquier");
			var trChild = echiquierHTML.childNodes;
  			for(row = 0; row<8; row++)
				{
				var tdChild = trChild[row].childNodes;
 				for(col = 0; col<8; col++)
				{
					var c = tdChild[col];
					if(deplacement(piece, j, i, col, row))
					{
						c.setAttribute("style","width: 3em; text-align: center; font-family: sans-serif; background-color: yellow");
	    				c.setAttribute("ondragover", "allowDrop(event)");
	  	  	      	c.setAttribute("ondrop", "drop(event, " + i + ", " + j + ", " + row + ", " + col + ")");
	    			}
				}
		}
	}
	masqueClique = true;
	}}

function deselect()
{
	if(masqueClique)
	   masqueClique = false;
	else
		afficher();
}
	
function sgn(x)
{
	if(x == 0)
		return 0;
	else if(x>0)
		return 1;
	else
		return -1;
}	
	
function libre(x0,y0,x,y){
	nbCases = Math.max(Math.abs(x - x0), Math.abs(y - y0));
	dirX = sgn(x - x0);
	dirY = sgn(y - y0);
	for(k = 1; k<nbCases; k++)
	{
		if(pieceposition(y0 + k*dirY,x0 + k*dirX) != undefined)
			return false;
	}
	return true;
	}

function memeCouleur(x0, y0, x, y){
	var arrive = pieceposition(y, x);
	var depart = pieceposition(y0,x0);
	if (arrive == undefined)
		{
		return false;
		}
	else{
	if(arrive == arrive.toLowerCase()){
		if (depart == depart.toLowerCase()){
			return true;
			}
		else{
			return false;
			}
		}
	else{
		if (depart == depart.toLowerCase()){
			return false;
			}
		else{
			return true;
			}
		}
		}
	}
	
function deplacement(piece, x0,y0,x,y){ //en fonction de la piece donne les bonnes regles de mouvements
	if ((piece == 'r') || (piece == 'R'))
		{
		return (x == x0 || y == y0) && libre(x0, y0, x, y) && !memeCouleur(x0, y0, x, y);
		}
	if ((piece == 'k') || (piece == 'K'))
		{
		return Math.max(Math.abs(x - x0), Math.abs(y - y0)) <= 1 && !memeCouleur(x0, y0, x, y);
		}
	if ((piece == 'b') || (piece =='B')){
		return Math.abs(x - x0) == Math.abs(y - y0) && libre(x0, y0, x, y) && !memeCouleur(x0, y0, x, y);
		}
	if ((piece == 'n') || (piece == 'N')){
		dX = Math.abs(x - x0);
		dY = Math.abs(y - y0);
		maxD = Math.max(dX, dY);
		minD = Math.min(dX, dY);
		return maxD == 2 && minD == 1 && !memeCouleur(x0, y0, x, y);
		}
	if ((piece == 'q') || (piece == 'Q')){
		return ((x == x0 || y == y0) && libre(x0, y0, x, y) && !memeCouleur(x0, y0, x, y)) || (Math.abs(x - x0) == Math.abs(y - y0) && libre(x0, y0, x, y) && !memeCouleur(x0, y0, x, y));
		}
	if ((piece == 'p') || (piece == 'P')){
		var dirY = piece == 'p' ? 1 : -1;
		if((piece =='p' && y0 == 1) || (piece =='P' && y0 == 6))
			dirY *= 2;
		var deplVertAbs = (y - y0)/dirY;
		if(pieceposition(y, x) == undefined)
			return x == x0 && deplVertAbs <= 1 && deplVertAbs>0 && libre(x0, y0, x, y);
		dirY = piece == 'p' ? 1 : -1;
		deplVertAbs = (y - y0)/dirY;
		return deplVertAbs == 1 && Math.abs(x - x0) == 1 && !memeCouleur(x0, y0, x, y);
		}
	}
	
function allowDrop(ev)
{
  ev.preventDefault();
}

function drag(ev)
{
  ev.dataTransfer.setData("Text", ev.target.id);
}

function drop(ev, i, j, row, col)
{
  ev.preventDefault();
  try
  {
  	deplace(i, j, row, col);
	afficher();
  }
  catch(err)
  {
    msg = document.getElementById("status-msg");
    msg.innerHTML = err;
  	}
}

function deplace(x0,y0,x,y){ // met a jour la string FEN avec le movement de la piece en x0,y0 qui va en x,y
	var FENarray = FEN.split("/");
	
	var tempLigneDepart = FENarray[x0];
	var compteCase = 0;
	for(point = 0; point < tempLigneDepart.length; point++){
		if(compteCase >= y0){
			break;
			}
		else{
			if(isNaN(tempLigneDepart[point])){
				compteCase++;
				}
			else{
				compteCase += tempLigneDepart[point];
				}
			}
		}
	
	if(!(isNaN(tempLigneDepart[point - 1])) && !(isNaN(tempLigneDepart[point + 1]))){
		var temp = 1 + parseInt(tempLigneDepart[point + 1]) + parseInt(tempLigneDepart[point - 1]);
		tempLigneDepart = tempLigneDepart.slice(0, point - 1) + temp + tempLigneDepart.slice(point + 2);
		}
	else{
	if(!(isNaN(tempLigneDepart[point - 1]))){
		var temp = 1 + parseInt(tempLigneDepart[point - 1]);
		tempLigneDepart = tempLigneDepart.slice(0, point - 1) + temp + tempLigneDepart.slice(point + 1);
		}
	if(!(isNaN(tempLigneDepart[point + 1]))){
		var temp = 1 + parseInt(tempLigneDepart[point + 1]);
		tempLigneDepart = tempLigneDepart.slice(0, point) + temp + tempLigneDepart.slice(point + 2);
		}
	else{
		tempLigneDepart = tempLigneDepart.slice(0, point) + "1" + tempLigneDepart.slice(point + 1);
		}
		}
		
	var pieceDeplace = pieceposition(x0,y0);
		
	var tempLigneArriv = FENarray[x];
	var compteCase2 = 0;
	for(point2 = 0; point2 < tempLigneArriv.length; point2++){
		if(compteCase2 >= y){
			break;
			}
		else{
			if(isNaN(tempLigneArriv[point2])){
				compteCase2++;
				}
			else{
				compteCase2 += tempLigneArriv[point2];
				}
			}
		}
	
	var tempFENarriv = "";
	for(i = 0; i < tempLigneArriv.length; i++){
		if (isNaN(tempLigneArriv[i])){
			tempFENarriv += tempLigneArriv[i];
			}
		else{
			var tempstr = "";
			for(j = 0; j < tempLigneArriv[i]; j++){
				tempstr += "1";
				}
			tempFENarriv += tempstr;
			}
		}
	tempFENarriv = tempFENarriv.slice(0,y) + pieceDeplace + tempFENarriv.slice(y + 1);
	tempLigneArriv = "";
	var compteur = 0;
	for(i = 0; i<tempFENarriv.length;i++){
		if(isNaN(tempFENarriv[i])){
			tempLigneArriv += tempFENarriv[i];
			}
		else{
			compteur++;
			if(isNaN(tempFENarriv[i + 1])){
				tempLigneArriv += compteur;
				compteur = 0;
				}
			}
		}
			
	var tempFEN = "";
	for (i = 0; i<8; i++){
		switch(i){
			case x0:
				tempFEN += tempLigneDepart + "/";
				break;
			case x:
				tempFEN += tempLigneArriv + "/";
				break;
			default:
				tempFEN += FENarray[i]+"/";
				break;
			}
		}
	tempFEN.slice(tempFEN.length - 1);
	FEN = tempFEN;
	compteTour += 1;
	}
	
function save()
{
	localStorage.FEN = JSON.stringify(FEN);
	localStorage.tour = JSON.stringify(compteTour);
}


function load()
{
	if(localStorage.FEN != undefined)
	{
		var e = JSON.parse(localStorage.FEN);
		FEN = e;
		var f = JSON.parse(localStorage.tour);
		compteTour = f;
		afficher();
	}
}

function newMatch(){
	FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
	compteTour = 0;
	}