
var startEndNodearray = new Array(-205 , 0 , -1 , -169 , 28 , -1 , 65 , 1 , -2 , -205 , 0 , -1 , 79 , 15 , 0 , 65 , 1 , -2 , 65 , 1 , -2 , 61 , 26 , -2 , 79 , 15 , 0 , 61 , 26 , -2 , -169 , 28 , -1 , 61 , 26 , -2 , 79 , 15 , 0 , 79 , 15 , 0 , 76 , 52 , -1 , 79 , 15 , 0 , 76 , 52 , -1 , 76 , 52 , -1 , 59 , 27 , -2 , 76 , 52 , -1 , -27 , 0 , -126 , -25 , -2 , 130 , -105 , -1 , 0 , -105 , -1 , 0 , -45 , -1 , -125 , -105 , -1 , 0 , -105 , -1 , 0 , -44 , -1 , 130 , -25 , -2 , 130 , -44 , -1 , 130 , -45 , -1 , -125 , -27 , -2 , -126);
//for erasing previous rotated/zoomed object
var prevousZoomScreenBR = 0;
var previousXRotation = 0;
var previousYRotation = 0;
var previousZRotation = 0;

//default node start and node end values which will not change due to calculations
var startx = 0;
var starty = 0;
var startz = 0;
var endx = 0;
var endy = 0;
var endz = 0;

//rotation
var xRotate = 45;
var yRotate = 45;
var zRotate = 45;
var zoom = 1;

var midX = 640;
var midY = 480;

var ValuesofObject = 2600;

var domCount = 0;
var lineCount = 0;

var sinArray = new Array();
var cosArray = new Array();

var i;
for(i = 0; i < 360; i++){
	sinArray[i] = Math.sin(i / (180 / Math.PI));
	cosArray[i] = Math.cos(i / (180 / Math.PI));
}


function drawLine(x1,y1,x2,y2, midX, midY, remove){
	if((x1 != 0 && x2 != 0 && y1 != 0 && y2 != 0) && (x1 != x2 && y1 != y2) && (x1 === x1 && y1 === y1 &&  x2 === x2 && y2 === y2 ) ){
	  	if (x2 < x1)
	    {
	        var tempX = x1;
	        var tempY = y1;
	        x1 = x2;
	        y1 = y2;
	        x2 = tempX;
	        y2 = tempY;
	    }

		//calculate the position of x1 based on the midpoint of the screen.
	    x1 = x1 + midX;
		x2 = x2 + midX;
		y1 = y1 + midY;
		y2 = y2 + midY;
		$( document ).ready(function() {
			if(domCount > 6000){
				$("#canvas").empty();
				domCount = 0;
			}
			if(!remove){


				var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
			    newLine.setAttribute('x1', x1);
			    newLine.setAttribute('y1', y1);
			    newLine.setAttribute('x2', x2);
			    newLine.setAttribute('y2', y2);
			    newLine.setAttribute('style', "stroke:rgb(0,255,0);stroke-width:1");

				$("#canvas").append(newLine);
			} else {
				var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
			    newLine.setAttribute('x1', x1);
			    newLine.setAttribute('y1', y1);
			    newLine.setAttribute('x2', x2);
			    newLine.setAttribute('y2', y2);
			    newLine.setAttribute('style', "stroke:rgb(255,255,255);stroke-width:2");

				$("#canvas").append(newLine);
				
			}
	    	
			domCount++;
			lineCount++;
		});

	 //switch points when first point is behind second point on x axel
	}
  
	
}

var interval = setInterval(function(){	

	//local rotation and zoom values
	var localRotationX = xRotate;
	var localRotationY = yRotate;
	var localRotationZ = zRotate;
	var zoomscreen = zoom;
	var linesDrawn = 0;
	for (;;)
	{
		//skips index every interation by 6
		var indexOfArray = linesDrawn * 6;

		//read start node from global array
		var x1 = startx = startEndNodearray[indexOfArray];
		var y1 = starty = startEndNodearray[indexOfArray + 1];
		var z1 = startz = startEndNodearray[indexOfArray + 2];

		//read end node from global array
		var x2 = endx = startEndNodearray[indexOfArray + 3];
		var y2 = endy = startEndNodearray[indexOfArray + 4];
		var z2 = endz = startEndNodearray[indexOfArray + 5];


		//if start and end node are both zero (if array has less then 240 elements) stop the draw loop and do not perform calculations
		if((x1 == 0 || x1 === undefined || isNaN(x1)) && (x2 == 0 || x2 === undefined || isNaN(x2)) && (y1 == 0 || y1 === undefined || isNaN(y1)) && (y2 == 0 || y2 === undefined|| isNaN(y2)) && (z1 == 0 || z1 === undefined|| isNaN(z1)) && (z2 == 0 || z2 === undefined|| isNaN(z2))){
			break;
		}

		//if a change happend in either the rotation or zoom, remove the previous known object calculated with the previous known zoom and rotation from screen
		if(previousXRotation != localRotationX || previousYRotation != localRotationY || previousZRotation != localRotationZ || zoomscreen != prevousZoomScreenBR)
		{
			 //perform rotation calculations on the 3 dimensonal nodes and convert them to 2D nodes and then perform zoom calculation.
			
			 x1 = (((startx * cosArray[previousXRotation] - (starty * cosArray[previousZRotation] - startz * sinArray[previousZRotation]) * sinArray[previousXRotation]) * (cosArray[previousYRotation])) + (starty * sinArray[previousZRotation] + startz * cosArray[previousZRotation]) * sinArray[previousYRotation]) * prevousZoomScreenBR;
			 x2 = (((endx * cosArray[previousXRotation] - (endy * cosArray[previousZRotation] - endz * sinArray[previousZRotation]) * sinArray[previousXRotation]) * (cosArray[previousYRotation])) + (endy * sinArray[previousZRotation] + endz * cosArray[previousZRotation]) * sinArray[previousYRotation]) * prevousZoomScreenBR;

			 y1 = (((-(startx * cosArray[previousXRotation] - (starty * cosArray[previousZRotation] - startz * sinArray[previousZRotation]) * sinArray[previousXRotation])) * (sinArray[previousYRotation]) + (starty * sinArray[previousZRotation] + startz * cosArray[previousZRotation]) * cosArray[previousYRotation])) * prevousZoomScreenBR;
			 y2 = (((-(endx * cosArray[previousXRotation] - (endy * cosArray[previousZRotation] - endz * sinArray[previousZRotation]) * sinArray[previousXRotation])) * (sinArray[previousYRotation]) + (endy * sinArray[previousZRotation] + endz * cosArray[previousZRotation]) * cosArray[previousYRotation])) * prevousZoomScreenBR;

			 drawLine(x1,y1,x2,y2, midX, midY, true);
		}

		 //perform rotation calculations on the 3 dimensonal nodes and convert them to 2D nodes and then perform zoom calculation.
		 x1 = (((startx * cosArray[localRotationX] - (starty * cosArray[localRotationZ] - startz * sinArray[localRotationZ]) * sinArray[localRotationX]) * (cosArray[localRotationY])) + (starty * sinArray[localRotationZ] + startz * cosArray[localRotationZ]) * sinArray[localRotationY]) * zoomscreen;
		 x2 = (((endx * cosArray[localRotationX] - (endy * cosArray[localRotationZ] - endz * sinArray[localRotationZ]) * sinArray[localRotationX]) * (cosArray[localRotationY])) + (endy * sinArray[localRotationZ] + endz * cosArray[localRotationZ]) * sinArray[localRotationY]) * zoomscreen;

		 y1 = (((-(startx * cosArray[localRotationX] - (starty * cosArray[localRotationZ] - startz * sinArray[localRotationZ]) * sinArray[localRotationX])) * (sinArray[localRotationY]) + (starty * sinArray[localRotationZ] + startz * cosArray[localRotationZ]) * cosArray[localRotationY]))* zoomscreen;
		 y2 = (((-(endx * cosArray[localRotationX] - (endy * cosArray[localRotationZ] - endz * sinArray[localRotationZ]) * sinArray[localRotationX])) * (sinArray[localRotationY]) + (endy * sinArray[localRotationZ] + endz * cosArray[localRotationZ]) * cosArray[localRotationY]))* zoomscreen;

		drawLine(x1,y1,x2,y2, midX, midY, false);

		linesDrawn++
		
	}
		if (zoomscreen != prevousZoomScreenBR)
		{
			prevousZoomScreenBR = zoomscreen;
		}

		//remember previous rotation
		previousXRotation = localRotationX;
		previousYRotation = localRotationY;
		previousZRotation = localRotationZ;
		lineCount = 0;

	//save previous zoomscreen if its different then before
		
/*$( document ).ready(function() {
	$("#canvas").html("");
}); */

	//clearInterval(interval);

}, 1000/60);

$(document).keydown(function(e) {
    switch(e.which) {
        case 37: // left
        xRotate--;
        console.log(xRotate);
        break;

        case 38: // up
        if(yRotate > 359){
        	yRotate = 0;
        }
        yRotate++;
        console.log(yRotate);
        break;

        case 39: // right
        if(xRotate > 359){
        	xRotate = 0;
        }
        xRotate++;
        console.log(xRotate);
        break;

        case 40: // down
        if(yRotate < 0){
        	yRotate = 359;
        }
        yRotate--;
        console.log(yRotate);
        break;

        case 188:
        if(zRotate < 0){
        	zRotate = 359;
        }
        zRotate--;
        console.log(zRotate);
        break;

        case 190:
        if(zRotate > 359){
        	zRotate = 0;
        }
        zRotate++;
        console.log(zRotate);
        break;

        case 107:
        zoom = zoom + 0.01;        
        console.log(zoom);
        break;

        case 109:
        zoom = zoom - 0.01;   
        console.log(zoom);
        break;

        case 187:
        zoom = zoom + 0.01;        
        console.log(zoom);
        break;

        case 189:
        zoom = zoom - 0.01;   
        console.log(zoom);
        break;

        default: return; // exit this handler for other keys

    }
    $("#info").html("x: " + xRotate + ", y:" + yRotate + ", z:" + zRotate + ", zoom: " + zoom);
    e.preventDefault(); // prevent the default action (scroll / move caret)
});


function Plane(){
	startEndNodearray = new Array(-205 , 0 , -1 , -169 , 28 , -1 , 65 , 1 , -2 , -205 , 0 , -1 , 79 , 15 , 0 , 65 , 1 , -2 , 65 , 1 , -2 , 61 , 26 , -2 , 79 , 15 , 0 , 61 , 26 , -2 , -169 , 28 , -1 , 61 , 26 , -2 , 79 , 15 , 0 , 79 , 15 , 0 , 76 , 52 , -1 , 79 , 15 , 0 , 76 , 52 , -1 , 76 , 52 , -1 , 59 , 27 , -2 , 76 , 52 , -1 , -27 , 0 , -126 , -25 , -2 , 130 , -105 , -1 , 0 , -105 , -1 , 0 , -45 , -1 , -125 , -105 , -1 , 0 , -105 , -1 , 0 , -44 , -1 , 130 , -25 , -2 , 130 , -44 , -1 , 130 , -45 , -1 , -125 , -27 , -2 , -126);
}

function Sphere(){
	startEndNodearray = new Array(-16 , 114 , -16 , -22 , 114 , 0 , -16 , 114 , -16 , 0 , 114 , -22 , -16 , 114 , -16 , 0 , 116 , 0 , -16 , 114 , -16 , 16 , 114 , -16 , -16 , 114 , -16 , -16 , 114 , 16 , -68 , 64 , -68 , 0 , 64 , -96 , -68 , 64 , -68 , -96 , 64 , 0 , -68 , 64 , -68 , -80 , -22 , -80 , -68 , 64 , -68 , -16 , 114 , -16 , -22 , 114 , 0 , -16 , 114 , 16 , -22 , 114 , 0 , 0 , 116 , 0 , -22 , 114 , 0 , 0 , 114 , -22 , -22 , 114 , 0 , 0 , 114 , 22 , 0 , 116 , 0 , 0 , 114 , -22 , 0 , 116 , 0 , 0 , 114 , 22 , 0 , 116 , 0 , 22 , 114 , 0 , 0 , 114 , -22 , 16 , 114 , -16 , 0 , 114 , -22 , 22 , 114 , 0 , 16 , 114 , -16 , 22 , 114 , 0 , 16 , 114 , -16 , 0 , 116 , 0 , 16 , 114 , -16 , 16 , 114 , 16 , 68 , 64 , -68 , 0 , 64 , -96 , 68 , 64 , -68 , 96 , 64 , 0 , 68 , 64 , -68 , 80 , -22 , -80 , 68 , 64 , -68 , 16 , 114 , -16 , 0 , 64 , -96 , 0 , -22 , -114 , 0 , 64 , -96 , 0 , 114 , -22 , -80 , -22 , -80 , 0 , -22 , -114 , -80 , -22 , -80 , -114 , -22 , 0 , -80 , -22 , -80 , -45 , -96 , -45 , 0 , -22 , -114 , 80 , -22 , -80 , 0 , -22 , -114 , 0 , -96 , -64 , 80 , -22 , -80 , 114 , -22 , 0 , 80 , -22 , -80 , 45 , -96 , -45 , 45 , -96 , -45 , 0 , -96 , -64 , 45 , -96 , -45 , 64 , -96 , 0 , 45 , -96 , -45 , 0 , -116 , 0 , 0 , -96 , -64 , -45 , -96 , -45 , 0 , -96 , -64 , 0 , -116 , 0 , -45 , -96 , -45 , -64 , -96 , 0 , -45 , -96 , -45 , 0 , -116 , 0 , 0 , -116 , 0 , -45 , -96 , 45 , 0 , -116 , 0 , 45 , -96 , 45 , -64 , -96 , 0 , -45 , -96 , 45 , -64 , -96 , 0 , 0 , -116 , 0 , -64 , -96 , 0 , -114 , -22 , 0 , -45 , -96 , 45 , 0 , -96 , 64 , -45 , -96 , 45 , -80 , -22 , 80 , 0 , -96 , 64 , 45 , -96 , 45 , 0 , -96 , 64 , 0 , -116 , 0 , 0 , -96 , 64 , 0 , -22 , 114 , 45 , -96 , 45 , 64 , -96 , 0 , 45 , -96 , 45 , 80 , -22 , 80 , 64 , -96 , 0 , 0 , -116 , 0 , 64 , -96 , 0 , 114 , -22 , 0 , 80 , -22 , 80 , 0 , -22 , 114 , 80 , -22 , 80 , 114 , -22 , 0 , 80 , -22 , 80 , 68 , 64 , 68 , 0 , -22 , 114 , -80 , -22 , 80 , 0 , -22 , 114 , 0 , 64 , 96 , 0 , 64 , 96 , -68 , 64 , 68 , 0 , 64 , 96 , 68 , 64 , 68 , 0 , 64 , 96 , 0 , 114 , 22 , -68 , 64 , 68 , -96 , 64 , 0 , -68 , 64 , 68 , -80 , -22 , 80 , -68 , 64 , 68 , -16 , 114 , 16 , -80 , -22 , 80 , -114 , -22 , 0 , -114 , -22 , 0 , -96 , 64 , 0 , -96 , 64 , 0 , -22 , 114 , 0 , -16 , 114 , 16 , 0 , 114 , 22 , -16 , 114 , 16 , 0 , 116 , 0 , -16 , 114 , 16 , 16 , 114 , 16 , 0 , 114 , 22 , 16 , 114 , 16 , 0 , 114 , 22 , 22 , 114 , 0 , 16 , 114 , 16 , 22 , 114 , 0 , 16 , 114 , 16 , 0 , 116 , 0 , 96 , 64 , 0 , 68 , 64 , 68 , 96 , 64 , 0 , 114 , -22 , 0 , 96 , 64 , 0 , 22 , 114 , 0 , 68 , 64 , 68 , 16 , 114 , 16);
}

function Piramide(){
	startEndNodearray = new Array(0 , 100 , 0 , 100 , 20 , 100 , 0 , 100 , 0 , 100 , 20 , -100 , 0 , 100 , 0 , -100 , 20 , 100 , 0 , 100 , 0 , -100 , 20 , -100 , -100 , 20 , -100 , -100 , 20 , 100 , 100 , 20 , -100 , 100 , 20 , 100 , -100 , 20 , -100 , 100 , 20 , -100 , -100 , 20 , 100 , 100 , 20 , 100);
}

function Bunny(){
	startEndNodearray = new Array(28 , 25 , 54 , 38 , 35 , 53 , 28 , 25 , 54 , 27 , 35 , 37 , 28 , 25 , 54 , 33 , 22 , 75 , 28 , 25 , 54 , 17 , 19 , 36 , 52 , 22 , 62 , 66 , 25 , 52 , 52 , 22 , 62 , 68 , 17 , 67 , 52 , 22 , 62 , 48 , 15 , 81 , 52 , 22 , 62 , 38 , 35 , 53 , 38 , 35 , 53 , 45 , 36 , 37 , 38 , 35 , 53 , 27 , 35 , 37 , 27 , 35 , 37 , 45 , 36 , 37 , 27 , 35 , 37 , 17 , 19 , 36 , 17 , 19 , 36 , -8 , 22 , 37 , 17 , 19 , 36 , 32 , 22 , 13 , -3 , 27 , 60 , -23 , 19 , 55 , -3 , 27 , 60 , -8 , 22 , 37 , -3 , 27 , 60 , -19 , 14 , 74 , -3 , 27 , 60 , 12 , 20 , 79 , 33 , 22 , 75 , 48 , 15 , 81 , 33 , 22 , 75 , 12 , 20 , 79 , 33 , 22 , 75 , 52 , 22 , 62 , 12 , 20 , 79 , 4 , 14 , 87 , 12 , 20 , 79 , 28 , 1 , 88 , 4 , 14 , 87 , 1 , 9 , 103 , 4 , 14 , 87 , -5 , 13 , 102 , 4 , 14 , 87 , 11 , -5 , 91 , 28 , 1 , 88 , 11 , -5 , 91 , 28 , 1 , 88 , 33 , 22 , 75 , 28 , 1 , 88 , 48 , 15 , 81 , 11 , -5 , 91 , 6 , 0 , 105 , 11 , -5 , 91 , 1 , 9 , 103 , 25 , -28 , 82 , 7 , -25 , 83 , 25 , -28 , 82 , 47 , -43 , 81 , 25 , -28 , 82 , 11 , -5 , 91 , 25 , -28 , 82 , 20 , -44 , 59 , 25 , -28 , 82 , 5 , -39 , 65 , 55 , -15 , 97 , 58 , 1 , 92 , 55 , -15 , 97 , 54 , -33 , 92 , 55 , -15 , 97 , 76 , -9 , 89 , 55 , -15 , 97 , 28 , 1 , 88 , 54 , -33 , 92 , 47 , -43 , 81 , 54 , -33 , 92 , 74 , -40 , 76 , 54 , -33 , 92 , 82 , -28 , 82 , 47 , -43 , 81 , 74 , -40 , 76 , 47 , -43 , 81 , 43 , -56 , 56 , 20 , -44 , 59 , 26 , -55 , 50 , 20 , -44 , 59 , 5 , -39 , 65 , 20 , -44 , 59 , 43 , -56 , 56 , 26 , -55 , 50 , 43 , -56 , 56 , 26 , -55 , 50 , 31 , -58 , 30 , 26 , -55 , 50 , 47 , -58 , 34 , 43 , -56 , 56 , 56 , -56 , 50 , 43 , -56 , 56 , 47 , -58 , 34 , 74 , -40 , 76 , 82 , -28 , 82 , 74 , -40 , 76 , 87 , -36 , 64 , 56 , -56 , 50 , 47 , -58 , 34 , 56 , -56 , 50 , 75 , -48 , 44 , 56 , -56 , 50 , 26 , -55 , 50 , 66 , 25 , 52 , 77 , 21 , 40 , 66 , 25 , 52 , 68 , 17 , 67 , 66 , 25 , 52 , 57 , 29 , 33 , 75 , -48 , 44 , 64 , -47 , 22 , 75 , -48 , 44 , 87 , -36 , 64 , 75 , -48 , 44 , 92 , -29 , 34 , 87 , -36 , 64 , 95 , -28 , 48 , 87 , -36 , 64 , 82 , -28 , 82 , 95 , -28 , 48 , 92 , -29 , 34 , 95 , -28 , 48 , 95 , -13 , 36 , 95 , -28 , 48 , 103 , -14 , 36 , 93 , -3 , 69 , 82 , 12 , 64 , 93 , -3 , 69 , 91 , 8 , 50 , 93 , -3 , 69 , 76 , -9 , 89 , 93 , -3 , 69 , 82 , -28 , 82 , 82 , -28 , 82 , 76 , -9 , 89 , 76 , -9 , 89 , 58 , 1 , 92 , 76 , -9 , 89 , 70 , 15 , 81 , 58 , 1 , 92 , 48 , 15 , 81 , 58 , 1 , 92 , 70 , 15 , 81 , 70 , 15 , 81 , 68 , 17 , 67 , 70 , 15 , 81 , 82 , 12 , 64 , 70 , 15 , 81 , 48 , 15 , 81 , 68 , 17 , 67 , 82 , 12 , 64 , 82 , 12 , 64 , 91 , 8 , 50 , 77 , 21 , 40 , 75 , 18 , 23 , 77 , 21 , 40 , 91 , 8 , 50 , 77 , 21 , 40 , 57 , 29 , 33 , 91 , 8 , 50 , 95 , -13 , 36 , 91 , -4 , 27 , 99 , -5 , 22 , 91 , -4 , 27 , 95 , -13 , 36 , 91 , -4 , 27 , 103 , -14 , 36 , 91 , -4 , 27 , 105 , -15 , 24 , 95 , -13 , 36 , 103 , -14 , 36 , 95 , -13 , 36 , 105 , -15 , 24 , 95 , -13 , 36 , 92 , -29 , 34 , 103 , -14 , 36 , 105 , -15 , 24 , 103 , -14 , 36 , 99 , -5 , 22 , 99 , -5 , 22 , 105 , -15 , 24 , 99 , -5 , 22 , 95 , -13 , 36 , 86 , -8 , 0 , 79 , 1 , 10 , 86 , -8 , 0 , 91 , -24 , 0 , 86 , -8 , 0 , 64 , -1 , 0 , 86 , -8 , 0 , 99 , -5 , 22 , 79 , 1 , 10 , 64 , -1 , 0 , 79 , 1 , 10 , 66 , 16 , 12 , 79 , 1 , 10 , 91 , -4 , 27 , 75 , 18 , 23 , 66 , 16 , 12 , 75 , 18 , 23 , 79 , 1 , 10 , 75 , 18 , 23 , 57 , 29 , 33 , 66 , 16 , 12 , 64 , 17 , 0 , 66 , 16 , 12 , 64 , -1 , 0 , 57 , 29 , 33 , 45 , 36 , 37 , 45 , 36 , 37 , 41 , 26 , 16 , 41 , 26 , 16 , 32 , 22 , 13 , 41 , 26 , 16 , 57 , 29 , 33 , 41 , 26 , 16 , 27 , 35 , 37 , 32 , 22 , 13 , 19 , 25 , 0 , 32 , 22 , 13 , 6 , 23 , 5 , 64 , 17 , 0 , 64 , -1 , 0 , 64 , 17 , 0 , 79 , 1 , 10 , 64 , 17 , 0 , 75 , 18 , 23 , 19 , 25 , 0 , 6 , 23 , 5 , 19 , 25 , 0 , 0 , 6 , 0 , 19 , 25 , 0 , 41 , 26 , 16 , 6 , 23 , 5 , 2 , 7 , 13 , 6 , 23 , 5 , 0 , 6 , 0 , 6 , 23 , 5 , -3 , 5 , 22 , 2 , 7 , 13 , -3 , 5 , 22 , 2 , 7 , 13 , 0 , 6 , 0 , 2 , 7 , 13 , -2 , -10 , 11 , 0 , 6 , 0 , -2 , -10 , 11 , 0 , 6 , 0 , -19 , 1 , 3 , -19 , 1 , 3 , -14 , -11 , 9 , -19 , 1 , 3 , -12 , -18 , 0 , -19 , 1 , 3 , -2 , -10 , 11 , -2 , -10 , 11 , 2 , -15 , 6 , -2 , -10 , 11 , -14 , -11 , 9 , -2 , -10 , 11 , -12 , -18 , 0 , -3 , 5 , 22 , -2 , -10 , 11 , -3 , 5 , 22 , -22 , 1 , 27 , -3 , 5 , 22 , 0 , 6 , 0 , -1 , -28 , 20 , -1 , -35 , 14 , -1 , -28 , 20 , 2 , -15 , 6 , -1 , -28 , 20 , -2 , -10 , 11 , -1 , -28 , 20 , 13 , -42 , 16 , -21 , -21 , 25 , -25 , -29 , 35 , -21 , -21 , 25 , -14 , -11 , 9 , -21 , -21 , 25 , -1 , -28 , 20 , -21 , -21 , 25 , -22 , 1 , 27 , -22 , 1 , 27 , -33 , 0 , 43 , -22 , 1 , 27 , -14 , -11 , 9 , -33 , 0 , 43 , -40 , -13 , 57 , -33 , 0 , 43 , -23 , 19 , 55 , -33 , 0 , 43 , -35 , -3 , 68 , -25 , -29 , 35 , -33 , -27 , 49 , -25 , -29 , 35 , -13 , -40 , 42 , -25 , -29 , 35 , -14 , -42 , 54 , -40 , -13 , 57 , -35 , -3 , 68 , -40 , -13 , 57 , -33 , -27 , 49 , -40 , -13 , 57 , -32 , -24 , 69 , -40 , -13 , 57 , -42 , -11 , 76 , -33 , -27 , 49 , -32 , -24 , 69 , -33 , -27 , 49 , -38 , -34 , 72 , -32 , -24 , 69 , -38 , -34 , 72 , -32 , -24 , 69 , -18 , -34 , 69 , -32 , -24 , 69 , -42 , -11 , 76 , -35 , -3 , 68 , -42 , -11 , 76 , -35 , -3 , 68 , -35 , 8 , 79 , -35 , -3 , 68 , -32 , -24 , 69 , -42 , -11 , 76 , -44 , -10 , 86 , -35 , 8 , 79 , -19 , 14 , 74 , -35 , 8 , 79 , -42 , -11 , 76 , -35 , 8 , 79 , -44 , -10 , 86 , -44 , -10 , 86 , -38 , -2 , 101 , -44 , -10 , 86 , -35 , -3 , 68 , -39 , -34 , 99 , -31 , -46 , 91 , -39 , -34 , 99 , -43 , -37 , 81 , -39 , -34 , 99 , -21 , -38 , 107 , -39 , -34 , 99 , -31 , -24 , 115 , -43 , -37 , 81 , -38 , -34 , 72 , -43 , -37 , 81 , -31 , -46 , 91 , -43 , -37 , 81 , -32 , -24 , 69 , -38 , -34 , 72 , -18 , -34 , 69 , -38 , -34 , 72 , -31 , -46 , 91 , -31 , -46 , 91 , -19 , -47 , 79 , -31 , -46 , 91 , -21 , -38 , 107 , -19 , -47 , 79 , -9 , -36 , 82 , -19 , -47 , 79 , -18 , -34 , 69 , -19 , -47 , 79 , -38 , -34 , 72 , -21 , -38 , 107 , -31 , -24 , 115 , -21 , -38 , 107 , -6 , -27 , 115 , -31 , -24 , 115 , -41 , -8 , 112 , -31 , -24 , 115 , -17 , -11 , 122 , -41 , -8 , 112 , -38 , -2 , 101 , -41 , -8 , 112 , -24 , 11 , 114 , -41 , -8 , 112 , -17 , -11 , 122 , -17 , -11 , 122 , -15 , 3 , 117 , -17 , -11 , 122 , -1 , -4 , 121 , -17 , -11 , 122 , 2 , -6 , 117 , -15 , 3 , 117 , -24 , 11 , 114 , -15 , 3 , 117 , -2 , 10 , 118 , -15 , 3 , 117 , -1 , -4 , 121 , -24 , 11 , 114 , -21 , 15 , 107 , -24 , 11 , 114 , -15 , 16 , 100 , -24 , 11 , 114 , -5 , 19 , 116 , -14 , 27 , 131 , -17 , 32 , 123 , -14 , 27 , 131 , -17 , 45 , 136 , -14 , 27 , 131 , -5 , 19 , 116 , -14 , 27 , 131 , 3 , 39 , 133 , 3 , 39 , 133 , -7 , 46 , 123 , 3 , 39 , 133 , 17 , 49 , 137 , 3 , 39 , 133 , -9 , 50 , 145 , 3 , 39 , 133 , 15 , 52 , 122 , -9 , 50 , 145 , -17 , 45 , 136 , -9 , 50 , 145 , 0 , 60 , 142 , -9 , 50 , 145 , 10 , 56 , 148 , -17 , 45 , 136 , -7 , 46 , 123 , -17 , 45 , 136 , -17 , 32 , 123 , -17 , 32 , 123 , -7 , 46 , 123 , -17 , 32 , 123 , -5 , 19 , 116 , -7 , 46 , 123 , -2 , 58 , 118 , -7 , 46 , 123 , -5 , 49 , 109 , -21 , 15 , 107 , -15 , 16 , 100 , -21 , 15 , 107 , -15 , 3 , 117 , -21 , 15 , 107 , -5 , 13 , 102 , -38 , -2 , 101 , -24 , 11 , 114 , -38 , -2 , 101 , -35 , 8 , 79 , -19 , 14 , 74 , -23 , 19 , 55 , -19 , 14 , 74 , -35 , -3 , 68 , -15 , 16 , 100 , -5 , 13 , 102 , -15 , 16 , 100 , -7 , 26 , 107 , -5 , 49 , 109 , -2 , 58 , 118 , -5 , 49 , 109 , -7 , 26 , 107 , -5 , 49 , 109 , 15 , 52 , 122 , -2 , 58 , 118 , 13 , 61 , 127 , -2 , 58 , 118 , 15 , 52 , 122 , 13 , 61 , 127 , 15 , 52 , 122 , 13 , 61 , 127 , 17 , 49 , 137 , 13 , 61 , 127 , 0 , 60 , 142 , 0 , 60 , 142 , 10 , 56 , 148 , 0 , 60 , 142 , 17 , 49 , 137 , 10 , 56 , 148 , 17 , 49 , 137 , 10 , 56 , 148 , 13 , 61 , 127 , 17 , 49 , 137 , 29 , 41 , 136 , 17 , 49 , 137 , 15 , 52 , 122 , -5 , 19 , 116 , -2 , 10 , 118 , -5 , 19 , 116 , -7 , 26 , 107 , -5 , 19 , 116 , -5 , 13 , 102 , -5 , 19 , 116 , 1 , 9 , 103 , -7 , 26 , 107 , -5 , 13 , 102 , -7 , 26 , 107 , -21 , 15 , 107 , -5 , 13 , 102 , 1 , 9 , 103 , -2 , 10 , 118 , 1 , 6 , 131 , -2 , 10 , 118 , -1 , -4 , 121 , 1 , 6 , 131 , -1 , -4 , 121 , 1 , 6 , 131 , 2 , -6 , 117 , 1 , 6 , 131 , 19 , 2 , 126 , -1 , -4 , 121 , 2 , -6 , 117 , 29 , 15 , 147 , 20 , 27 , 141 , 29 , 15 , 147 , 41 , 31 , 146 , 29 , 15 , 147 , 31 , 36 , 148 , 29 , 15 , 147 , 37 , 19 , 124 , 20 , 27 , 141 , 31 , 36 , 148 , 20 , 27 , 141 , 29 , 41 , 136 , 20 , 27 , 141 , 28 , 27 , 123 , 31 , 36 , 148 , 41 , 31 , 146 , 31 , 36 , 148 , 37 , 41 , 139 , 31 , 36 , 148 , 29 , 41 , 136 , 41 , 31 , 146 , 37 , 41 , 139 , 41 , 31 , 146 , 29 , 41 , 136 , 19 , 2 , 126 , 2 , -6 , 117 , 19 , 2 , 126 , -1 , -4 , 121 , 19 , 2 , 126 , -2 , 10 , 118 , 37 , 19 , 124 , 38 , 26 , 122 , 37 , 19 , 124 , 28 , 27 , 123 , 37 , 19 , 124 , 19 , 2 , 126 , 6 , 0 , 105 , 1 , 9 , 103 , 6 , 0 , 105 , 2 , -6 , 117 , 6 , 0 , 105 , -5 , 13 , 102 , 38 , 26 , 122 , 28 , 27 , 123 , 38 , 26 , 122 , 29 , 41 , 136 , 38 , 26 , 122 , 37 , 41 , 139 , 1 , 9 , 103 , -2 , 10 , 118 , 28 , 27 , 123 , 29 , 41 , 136 , 29 , 41 , 136 , 37 , 41 , 139 , 37 , 41 , 139 , 17 , 49 , 137 , 7 , -25 , 83 , -9 , -36 , 82 , 7 , -25 , 83 , 11 , -5 , 91 , 7 , -25 , 83 , 5 , -39 , 65 , 2 , -6 , 117 , -2 , 10 , 118 , -4 , -24 , 104 , -6 , -27 , 115 , -4 , -24 , 104 , -21 , -38 , 107 , -4 , -24 , 104 , 2 , -6 , 117 , -4 , -24 , 104 , 7 , -25 , 83 , -6 , -27 , 115 , -17 , -11 , 122 , -6 , -27 , 115 , 2 , -6 , 117 , -9 , -36 , 82 , -18 , -34 , 69 , -9 , -36 , 82 , 5 , -39 , 65 , -18 , -34 , 69 , -14 , -42 , 54 , 5 , -39 , 65 , -14 , -42 , 54 , -14 , -42 , 54 , -13 , -40 , 42 , -14 , -42 , 54 , -33 , -27 , 49 , 10 , -43 , 32 , 13 , -42 , 16 , 10 , -43 , 32 , -1 , -28 , 20 , 10 , -43 , 32 , -1 , -35 , 14 , 10 , -43 , 32 , -13 , -40 , 42 , -13 , -40 , 42 , -33 , -27 , 49 , 13 , -42 , 16 , -1 , -35 , 14 , 13 , -42 , 16 , 15 , -52 , 2 , 13 , -42 , 16 , 5 , -39 , 0 , 31 , -58 , 30 , 47 , -58 , 34 , 31 , -58 , 30 , 31 , -48 , 14 , 31 , -58 , 30 , 10 , -43 , 32 , 31 , -48 , 14 , 13 , -42 , 16 , 31 , -48 , 14 , 15 , -52 , 2 , 31 , -48 , 14 , 52 , -45 , 0 , 52 , -45 , 0 , 64 , -41 , 12 , 52 , -45 , 0 , 64 , -47 , 22 , 52 , -45 , 0 , 77 , -41 , 16 , 47 , -58 , 34 , 64 , -47 , 22 , 64 , -47 , 22 , 64 , -41 , 12 , 64 , -47 , 22 , 77 , -41 , 16 , 77 , -41 , 16 , 64 , -41 , 12 , 77 , -41 , 16 , 81 , -36 , 0 , 77 , -41 , 16 , 92 , -29 , 34 , 64 , -41 , 12 , 81 , -36 , 0 , 81 , -36 , 0 , 91 , -24 , 0 , 81 , -36 , 0 , 86 , -8 , 0 , 92 , -29 , 34 , 102 , -31 , 28 , 92 , -29 , 34 , 103 , -14 , 36 , 102 , -31 , 28 , 105 , -15 , 24 , 102 , -31 , 28 , 103 , -14 , 36 , 102 , -31 , 28 , 95 , -13 , 36 , 91 , -24 , 0 , 77 , -41 , 16 , 91 , -24 , 0 , 105 , -15 , 24 , -20 , -32 , 0 , -9 , -41 , 3 , -20 , -32 , 0 , -12 , -18 , 0 , -20 , -32 , 0 , -14 , -11 , 9 , -20 , -32 , 0 , -1 , -35 , 14 , -12 , -18 , 0 , -14 , -11 , 9 , -12 , -18 , 0 , 2 , -15 , 6 , 2 , -15 , 6 , -14 , -11 , 9 , -1 , -35 , 14 , -9 , -41 , 3 , -1 , -35 , 14 , 5 , -39 , 0 , -9 , -41 , 3 , 5 , -39 , 0 , -9 , -41 , 3 , -1 , -28 , 20 , 5 , -39 , 0 , 15 , -52 , 2 , 15 , -52 , 2 , -1 , -35 , 14 , -23 , 19 , 55 , -8 , 22 , 37 , -8 , 22 , 37 , -3 , 5 , 22);
}

function TheaPot(){
	startEndNodearray = new Array(-127 , -17 , 151 , -126 , -15 , 155 , -127 , -17 , 151 , -129 , -15 , 147 , -129 , -15 , 147 , -131 , -10 , 144 , -125 , -32 , 151 , -127 , -17 , 151 , -125 , -32 , 151 , -126 , -15 , 155 , -198 , 7 , 139 , -197 , 12 , 151 , -198 , 7 , 139 , -214 , 14 , 137 , -198 , 7 , 139 , -201 , -1 , 155 , -198 , 7 , 139 , -208 , -10 , 127 , -133 , -1 , 143 , -131 , 7 , 144 , -133 , -1 , 143 , -131 , -10 , 144 , -193 , -17 , 148 , -201 , -1 , 155 , -193 , -17 , 148 , -214 , -17 , 137 , -193 , -17 , 148 , -198 , 7 , 139 , -193 , -17 , 148 , -208 , -10 , 127 , -148 , 36 , 48 , -151 , 36 , 62 , -148 , 36 , 48 , -152 , 14 , 51 , -148 , 36 , 48 , -151 , 12 , 47 , -137 , 71 , 62 , -115 , 99 , 62 , -137 , 71 , 62 , -151 , 36 , 62 , -137 , 71 , 62 , -148 , 36 , 48 , -137 , 71 , 62 , -121 , 62 , 25 , -121 , 62 , 25 , -89 , 73 , 6 , -121 , 62 , 25 , -116 , 27 , 6 , -121 , 62 , 25 , -148 , 36 , 48 , 79 , -94 , 114 , 53 , -115 , 114 , 79 , -94 , 114 , 100 , -68 , 114 , 79 , -94 , 114 , 87 , -102 , 62 , 79 , -94 , 114 , 58 , -73 , 166 , 37 , -89 , 166 , 13 , -99 , 166 , 37 , -89 , 166 , 58 , -73 , 166 , 53 , -115 , 114 , 21 , -128 , 114 , 53 , -115 , 114 , 37 , -89 , 166 , -125 , 7 , 157 , -126 , 12 , 155 , -125 , 7 , 157 , -125 , -1 , 159 , -110 , 25 , 176 , -111 , 25 , 166 , -110 , 25 , 176 , -89 , 43 , 174 , -110 , 25 , 176 , -115 , -1 , 166 , -125 , 29 , 151 , -127 , 14 , 151 , -125 , 29 , 151 , -126 , 12 , 155 , -127 , 14 , 151 , -126 , 12 , 155 , -127 , 14 , 151 , -129 , 12 , 147 , -197 , 12 , 151 , -201 , -1 , 155 , -197 , 12 , 151 , -214 , 14 , 137 , -197 , 12 , 151 , -223 , 7 , 140 , -214 , 14 , 137 , -223 , 7 , 140 , -214 , 14 , 137 , -215 , 14 , 114 , -208 , -10 , 127 , -214 , -17 , 137 , -208 , -10 , 127 , -223 , -10 , 140 , -208 , -10 , 127 , -224 , -10 , 111 , -107 , 92 , 114 , -80 , 112 , 114 , -107 , 92 , 114 , -121 , 61 , 132 , -107 , 92 , 114 , -115 , 99 , 62 , -107 , 92 , 114 , -85 , 70 , 166 , -65 , 86 , 166 , -85 , 70 , 166 , -65 , 86 , 166 , -40 , 96 , 166 , -80 , 112 , 114 , -49 , 125 , 114 , -80 , 112 , 114 , -65 , 86 , 166 , -151 , 36 , 62 , -152 , 14 , 51 , -151 , 36 , 62 , -153 , 12 , 56 , -13 , 12 , 191 , -3 , 8 , 191 , -13 , 12 , 191 , -25 , 1 , 197 , -13 , 12 , 191 , -1 , -4 , 197 , -13 , 12 , 191 , -3 , -11 , 191 , -13 , 12 , 191 , -23 , -11 , 191 , -20 , 23 , 217 , 0 , 20 , 217 , -20 , 23 , 217 , -38 , 5 , 217 , -20 , 23 , 217 , -13 , 12 , 191 , -20 , 23 , 217 , -25 , 1 , 197 , -3 , 8 , 191 , -1 , -4 , 197 , -3 , 8 , 191 , -3 , -11 , 191 , -3 , 8 , 191 , -25 , 1 , 197 , 87 , -102 , 62 , 57 , -122 , 48 , 87 , -102 , 62 , 107 , -72 , 48 , 87 , -102 , 62 , 74 , -90 , 25 , 84 , 25 , 166 , 87 , -1 , 166 , 84 , 25 , 166 , 73 , 50 , 166 , -3 , -11 , 191 , -1 , -4 , 197 , -3 , -11 , 191 , -13 , -15 , 191 , -3 , -11 , 191 , -23 , -11 , 191 , -125 , -10 , 157 , -126 , -15 , 155 , -125 , -10 , 157 , -125 , -1 , 159 , -150 , -10 , 42 , -151 , -15 , 47 , -150 , -10 , 42 , -150 , -1 , 41 , -150 , -1 , 41 , -150 , 7 , 42 , -138 , -1 , 25 , -150 , -1 , 41 , -138 , -1 , 25 , -150 , 7 , 42 , -150 , 7 , 42 , -151 , 12 , 47 , -116 , 27 , 6 , -138 , -1 , 25 , -116 , 27 , 6 , -89 , 73 , 6 , -116 , 27 , 6 , -150 , 7 , 42 , -101 , -52 , 166 , -111 , -28 , 166 , -101 , -52 , 166 , -85 , -73 , 166 , -111 , -28 , 166 , -110 , -28 , 176 , -111 , -28 , 166 , -125 , -32 , 151 , -111 , -28 , 166 , -126 , -15 , 155 , -110 , -28 , 176 , -101 , -52 , 166 , -214 , -17 , 137 , -223 , -10 , 140 , -214 , -17 , 137 , -223 , 7 , 140 , -1 , -4 , 197 , -13 , -15 , 191 , 0 , -23 , 217 , 12 , -1 , 217 , 0 , -23 , 217 , -26 , -23 , 217 , 0 , -23 , 217 , -1 , -4 , 197 , 0 , -23 , 217 , -3 , -11 , 191 , -13 , -15 , 191 , -23 , -11 , 191 , -13 , -15 , 191 , -25 , 1 , 197 , -201 , -17 , 88 , -191 , -15 , 71 , -201 , -17 , 88 , -207 , 7 , 82 , -201 , -17 , 88 , -193 , -1 , 67 , -201 , -17 , 88 , -202 , 7 , 106 , -115 , 99 , 62 , -84 , 119 , 48 , -115 , 99 , 62 , -121 , 62 , 25 , -84 , 119 , 48 , -51 , 133 , 48 , -84 , 119 , 48 , -89 , 73 , 6 , -84 , 119 , 48 , -41 , 96 , 4 , 57 , -122 , 48 , 23 , -136 , 48 , 57 , -122 , 48 , 74 , -90 , 25 , 57 , -122 , 48 , 40 , -93 , 6 , -148 , -39 , 48 , -152 , -17 , 51 , -148 , -39 , 48 , -151 , -15 , 47 , -115 , -1 , 166 , -125 , -1 , 159 , -115 , -1 , 166 , -125 , 7 , 157 , 13 , -99 , 166 , -13 , -102 , 166 , 21 , -128 , 114 , -13 , -133 , 114 , 21 , -128 , 114 , 13 , -99 , 166 , 183 , 13 , 154 , 195 , 6 , 152 , 183 , 13 , 154 , 170 , 6 , 156 , 183 , 13 , 154 , 195 , 6 , 166 , 183 , 13 , 154 , 182 , -1 , 166 , 153 , 24 , 103 , 149 , 15 , 110 , 153 , 24 , 103 , 162 , 24 , 85 , 153 , 24 , 103 , 120 , 17 , 98 , 170 , 6 , 156 , 182 , -1 , 166 , 170 , 6 , 156 , 182 , -8 , 169 , 170 , 6 , 156 , 195 , 6 , 152 , 74 , 87 , 25 , 78 , 52 , 6 , 74 , 87 , 25 , 87 , 99 , 62 , 74 , 87 , 25 , 57 , 119 , 48 , 74 , 87 , 25 , 107 , 69 , 48 , 87 , 99 , 62 , 107 , 69 , 48 , 87 , 99 , 62 , 57 , 119 , 48 , 87 , 99 , 62 , 79 , 92 , 114 , 107 , 69 , 48 , 124 , 29 , 61 , -89 , 43 , 174 , -101 , 50 , 166 , -89 , 43 , 174 , -85 , 70 , 166 , -111 , 25 , 166 , -125 , 29 , 151 , -111 , 25 , 166 , -126 , 12 , 155 , -116 , -30 , 6 , -121 , -64 , 25 , -116 , -30 , 6 , -138 , -1 , 25 , -116 , -30 , 6 , -150 , -10 , 42 , -23 , -11 , 191 , -25 , 1 , 197 , -23 , -11 , 191 , -37 , 5 , 186 , -38 , -8 , 217 , -38 , 5 , 217 , -38 , -8 , 217 , -26 , -23 , 217 , -38 , -8 , 217 , -25 , 1 , 197 , -38 , -8 , 217 , -23 , -11 , 191 , -38 , 5 , 217 , -25 , 1 , 197 , -38 , 5 , 217 , -26 , -23 , 217 , -151 , -15 , 47 , -152 , -17 , 51 , -193 , -1 , 67 , -191 , -15 , 71 , -193 , -1 , 67 , -189 , 14 , 75 , -193 , -1 , 67 , -207 , 7 , 82 , -193 , -1 , 67 , -172 , 12 , 67 , -67 , -93 , 6 , -84 , -122 , 48 , -67 , -93 , 6 , -13 , -107 , 6 , -67 , -93 , 6 , -51 , -136 , 48 , -67 , -93 , 6 , -113 , -100 , 48 , 40 , -93 , 6 , 74 , -90 , 25 , 40 , -93 , 6 , -13 , -107 , 6 , 40 , -93 , 6 , 23 , -136 , 48 , 124 , -20 , 51 , 124 , -32 , 61 , 124 , -20 , 51 , 126 , -1 , 47 , 145 , -20 , 58 , 146 , -1 , 54 , 145 , -20 , 58 , 124 , -20 , 51 , 145 , -20 , 58 , 124 , -32 , 61 , 124 , -32 , 61 , 123 , -36 , 74 , 73 , 50 , 166 , 58 , 70 , 166 , 48 , 61 , 174 , 58 , 70 , 166 , 48 , 61 , 174 , 73 , 50 , 166 , 48 , 61 , 174 , 37 , 86 , 166 , -223 , -10 , 140 , -223 , 7 , 140 , -223 , -10 , 140 , -214 , 14 , 137 , -40 , 96 , 166 , -13 , 99 , 166 , -49 , 125 , 114 , -13 , 130 , 114 , -49 , 125 , 114 , -40 , 96 , 166 , 120 , -20 , 98 , 121 , -32 , 87 , 120 , -20 , 98 , 121 , -1 , 102 , 113 , -36 , 114 , 120 , -20 , 98 , 113 , -36 , 114 , 121 , -32 , 87 , 121 , -32 , 87 , 123 , -36 , 74 , 84 , -28 , 166 , 71 , -25 , 174 , 84 , -28 , 166 , 73 , -52 , 166 , 84 , -28 , 166 , 87 , -1 , 166 , 73 , -52 , 166 , 58 , -73 , 166 , -150 , -39 , 79 , -148 , -39 , 48 , -150 , -39 , 79 , -153 , -15 , 56 , -150 , -39 , 79 , -155 , -10 , 60 , -153 , -15 , 56 , -152 , -17 , 51 , -153 , -15 , 56 , -155 , -10 , 60 , -121 , -64 , 25 , -137 , -74 , 62 , -121 , -64 , 25 , -148 , -39 , 48 , -121 , -64 , 25 , -113 , -100 , 48 , -201 , -1 , 155 , -214 , 14 , 137 , -137 , -74 , 62 , -113 , -100 , 48 , -137 , -74 , 62 , -148 , -39 , 48 , -137 , -74 , 62 , -150 , -39 , 79 , -85 , 70 , 166 , -101 , 50 , 166 , -13 , -102 , 166 , -40 , -99 , 166 , 57 , 119 , 48 , 23 , 133 , 48 , 57 , 119 , 48 , 22 , 127 , 35 , -13 , 99 , 166 , 13 , 96 , 166 , -37 , 5 , 186 , -25 , 1 , 197 , -37 , 5 , 186 , -13 , 12 , 191 , -37 , 5 , 186 , -38 , 5 , 217 , -223 , 7 , 140 , -198 , 7 , 139 , 23 , -136 , 48 , -13 , -141 , 48 , 23 , -136 , 48 , -13 , -107 , 6 , -145 , -1 , 114 , -133 , -1 , 143 , -145 , -1 , 114 , -131 , 7 , 144 , -131 , 7 , 144 , -129 , 12 , 147 , 100 , -68 , 114 , 113 , -36 , 114 , 100 , -68 , 114 , 121 , -32 , 87 , -113 , -100 , 48 , -84 , -122 , 48 , 12 , -1 , 217 , -1 , -4 , 197 , 12 , -1 , 217 , 0 , 20 , 217 , 12 , -1 , 217 , -3 , 8 , 191 , -26 , -23 , 217 , -23 , -11 , 191 , -26 , -23 , 217 , -13 , -15 , 191 , -13 , -133 , 114 , -49 , -128 , 114 , -13 , -133 , 114 , -13 , -102 , 166 , 205 , 11 , 172 , 195 , 6 , 166 , 205 , 11 , 172 , 189 , 5 , 173 , 205 , 11 , 172 , 195 , 6 , 152 , 205 , 11 , 172 , 227 , 4 , 175 , -13 , -141 , 48 , -51 , -136 , 48 , -13 , -141 , 48 , -13 , -107 , 6 , -13 , -141 , 48 , -13 , -133 , 114 , 78 , 52 , 6 , 88 , 27 , 6 , 78 , 52 , 6 , 107 , 69 , 48 , 78 , 52 , 6 , 111 , -1 , 25 , -51 , 133 , 48 , -13 , 138 , 48 , -51 , 133 , 48 , -13 , 123 , 25 , -51 , 133 , 48 , -41 , 96 , 4 , 107 , -72 , 48 , 106 , -35 , 25 , 107 , -72 , 48 , 74 , -90 , 25 , 107 , -72 , 48 , 124 , -32 , 61 , -133 , 31 , 132 , -125 , 29 , 151 , -133 , 31 , 132 , -129 , 12 , 147 , -133 , 31 , 132 , -127 , 14 , 151 , -40 , -99 , 166 , -65 , -89 , 166 , -13 , 138 , 48 , -13 , 123 , 25 , -13 , 138 , 48 , 23 , 133 , 48 , -13 , 138 , 48 , 22 , 127 , 35 , -13 , 123 , 25 , 22 , 127 , 35 , -13 , 123 , 25 , 14 , 101 , 6 , -13 , 123 , 25 , 23 , 133 , 48 , 0 , 20 , 217 , -3 , 8 , 191 , 0 , 20 , 217 , -13 , 12 , 191 , -49 , -128 , 114 , -80 , -115 , 114 , -49 , -128 , 114 , -40 , -99 , 166 , -84 , -122 , 48 , -51 , -136 , 48 , -84 , -122 , 48 , -80 , -115 , 114 , 182 , -8 , 169 , 182 , -1 , 166 , 182 , -8 , 169 , 194 , -13 , 172 , 182 , -8 , 169 , 189 , 5 , 173 , 182 , -8 , 169 , 195 , 6 , 166 , 194 , -13 , 172 , 182 , -1 , 166 , 194 , -13 , 172 , 189 , 5 , 173 , 194 , -13 , 172 , 195 , 6 , 166 , 182 , -1 , 166 , 189 , 5 , 173 , 182 , -1 , 166 , 195 , 6 , 166 , 71 , -25 , 174 , 73 , -52 , 166 , -51 , -136 , 48 , -13 , -107 , 6 , 227 , 4 , 175 , 227 , -6 , 175 , 227 , 4 , 175 , 195 , 6 , 166 , 227 , 4 , 175 , 194 , -13 , 172 , 189 , 5 , 173 , 195 , 6 , 166 , 195 , 6 , 166 , 195 , 6 , 152 , -65 , -89 , 166 , -85 , -73 , 166 , -80 , -115 , 114 , -107 , -94 , 114 , -80 , -115 , 114 , -65 , -89 , 166 , 13 , 96 , 166 , 37 , 86 , 166 , 227 , -6 , 175 , 205 , 11 , 172 , 227 , -6 , 175 , 194 , -13 , 172 , 227 , -6 , 175 , 195 , 6 , 166 , 121 , -1 , 102 , 120 , 17 , 98 , -13 , 130 , 114 , 21 , 125 , 114 , -13 , 130 , 114 , -13 , 99 , 166 , -41 , 96 , 4 , -13 , 123 , 25 , -41 , 96 , 4 , -89 , 73 , 6 , -41 , 96 , 4 , 14 , 101 , 6 , -189 , 14 , 75 , -172 , 12 , 67 , -189 , 14 , 75 , -207 , 7 , 82 , -189 , 14 , 75 , -191 , -15 , 71 , -215 , 14 , 114 , -224 , 7 , 111 , -215 , 14 , 114 , -202 , 7 , 106 , -215 , 14 , 114 , -224 , -10 , 111 , -202 , 7 , 106 , -224 , 7 , 111 , -202 , 7 , 106 , -207 , 7 , 82 , -202 , 7 , 106 , -208 , -10 , 127 , -172 , 12 , 67 , -155 , 7 , 60 , -172 , 12 , 67 , -156 , -1 , 62 , 21 , 125 , 114 , 53 , 112 , 114 , 21 , 125 , 114 , 13 , 96 , 166 , -156 , -1 , 62 , -155 , 7 , 60 , -156 , -1 , 62 , -155 , -10 , 60 , 14 , 101 , 6 , 22 , 127 , 35 , 14 , 101 , 6 , 23 , 133 , 48 , -191 , -15 , 71 , -207 , 7 , 82 , -107 , -94 , 114 , -127 , -68 , 114 , -107 , -94 , 114 , -85 , -73 , 166 , 142 , 28 , 67 , 124 , 29 , 61 , 142 , 28 , 67 , 123 , 33 , 74 , 124 , 17 , 51 , 124 , 29 , 61 , 124 , 17 , 51 , 126 , -1 , 47 , 124 , 29 , 61 , 123 , 33 , 74 , 58 , 70 , 166 , 37 , 86 , 166 , -224 , -10 , 111 , -224 , 7 , 111 , -224 , -10 , 111 , -202 , 7 , 106 , 123 , 33 , 74 , 121 , 29 , 87 , 113 , 33 , 114 , 120 , 17 , 98 , 113 , 33 , 114 , 121 , 29 , 87 , 121 , 29 , 87 , 120 , 17 , 98 , -151 , 12 , 47 , -152 , 14 , 51 , 88 , -30 , 6 , 106 , -35 , 25 , 88 , -30 , 6 , 111 , -1 , 25 , 88 , -30 , 6 , 88 , 27 , 6 , 88 , -30 , 6 , 124 , -20 , 51 , -121 , 61 , 132 , -133 , 31 , 132 , -121 , 61 , 132 , -125 , 29 , 151 , -121 , 61 , 132 , -101 , 50 , 166 , -127 , -68 , 114 , -150 , -39 , 79 , -127 , -68 , 114 , -125 , -32 , 151 , -127 , -68 , 114 , -137 , -74 , 62 , -224 , 7 , 111 , -208 , -10 , 127 , 23 , 133 , 48 , 22 , 127 , 35 , -101 , 50 , 166 , -111 , 25 , 166 , 106 , -35 , 25 , 111 , -1 , 25 , 106 , -35 , 25 , 124 , -20 , 51 , 149 , 15 , 110 , 162 , 24 , 85 , 149 , 15 , 110 , 120 , 17 , 98 , 149 , -17 , 110 , 157 , -31 , 94 , 149 , -17 , 110 , 162 , -27 , 85 , 149 , -17 , 110 , 120 , -20 , 98 , -152 , 14 , 51 , -153 , 12 , 56 , 88 , 27 , 6 , 111 , -1 , 25 , 88 , 27 , 6 , 124 , 17 , 51 , 111 , -1 , 25 , 126 , -1 , 47 , 111 , -1 , 25 , 124 , 17 , 51 , 146 , -1 , 54 , 126 , -1 , 47 , 146 , -1 , 54 , 124 , 17 , 51 , -153 , 12 , 56 , -155 , 7 , 60 , 100 , 65 , 114 , 79 , 92 , 114 , 100 , 65 , 114 , 113 , 33 , 114 , 100 , 65 , 114 , 121 , 29 , 87 , 157 , -31 , 94 , 162 , -27 , 85 , 157 , -31 , 94 , 121 , -32 , 87 , 79 , 92 , 114 , 53 , 112 , 114 , 79 , 92 , 114 , 58 , 70 , 166 , 162 , -27 , 85 , 167 , -1 , 75 , 162 , -27 , 85 , 145 , -20 , 58 , 195 , -9 , 152 , 195 , 6 , 152 , 195 , -9 , 152 , 194 , -13 , 172 , 195 , -9 , 152 , 195 , 6 , 166 , 195 , -9 , 152 , 182 , -1 , 166 , 53 , 112 , 114 , 37 , 86 , 166 , 167 , -1 , 75 , 162 , 24 , 85 , 167 , -1 , 75 , 146 , -1 , 54 , 167 , -1 , 75 , 145 , -20 , 58 , 195 , 6 , 152 , 182 , -1 , 166 , 162 , 24 , 85 , 142 , 28 , 67);
}



