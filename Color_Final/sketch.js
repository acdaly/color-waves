var width;
var height;
var curves;
var waveLayers = 13;
var t=[];
var initialY;
var skyColor;


function setup() {
    width = windowWidth;
    height = windowHeight;
    initialY = int(height*(2/3));
    var cnv = createCanvas(width, height);
    cnv.parent('myContainer');
    
    curves = int(width/50);
    skyColor = color(170, 240, 255);
    create2DNoiseList();
    background(skyColor);
    console.log(curves +',' + t[0].length);
    
}



function createNoiseList(){
    var pointList = [];
    for (i = 0; i < 40 +1; i++) {
        append(pointList, random(0, 500));
    }
    return pointList;
}

function create2DNoiseList() {
    for (var i = 0; i<waveLayers; i++){
        append(t, createNoiseList());
    }
}

//color 0 is the furthest color

var color2 = {
    'r': 10,
    'g': 45,
    'b': 250
}

var color1 = {
    'r': 180,
    'g': 240,
    'b': 220
}

var color0 = {
    'r': 224,
    'g': 140,
    'b': 163
}

var colorList = [color0, color1, color2]

var twean = {
    'r': 0,
    'g': 0,
    'b': 0
}

function getTwean(c1, c2, z) {
    twean.r = (c1.r + (c2.r - c1.r)* (z/waveLayers) + (noise(t[z][1]) *40)  );
    twean.g = (c1.g + (c2.g - c1.g)* (z/waveLayers)  + (noise(t[z][1])*40) );
    twean.b = (c1.b + (c2.b - c1.b)* (z/waveLayers)  + (noise(t[z][1])*40) );
}

function getListTwean(c1, c2, i, z) {
    console.log(i);
    twean.r = (c1.r + (c2.r - c1.r)* (i/(colorList.length-1)) + (noise(t[z][1]) *40)  );
    twean.g = (c1.g + (c2.g - c1.g)* (i/(colorList.length-1))  + (noise(t[z][1])*40) );
    twean.b = (c1.b + (c2.b - c1.b)* (i/(colorList.length-1))  + (noise(t[z][1])*40) );
}



function fillColor(z){
    //color progression of the waves
    //z=0 is the furthest in space
    var hue = 20*z + 80;
    var saturation = 8 * (z);
    var brightness = 70 + (z*2.5);
    var hsbString='hsb('+str(hue)+','+str(saturation)+'%,'+str(brightness)+'%)';
    var index = int(z*((colorList.length -1)/waveLayers));
    var progressIndex = z % 6;
    getTwean(color0, color2, z);
    //getTwean(colorList[index], colorList[index+1], z);
    //getListTwean(colorList[index], colorList[index+1], progressIndex, z);

    var rgbString='rgb('+int(twean.r)+','+int(twean.g)+','+int(twean.b) +')';

    return color(rgbString);
}

function drawOcean(){
    var yOffset = 2;
    var yPower = 20;
    var xDist = width/curves;
    var xDistOffset = 1;
    var x, y;
    for (var z = 0; z < waveLayers; z++){
        
        beginShape();
        fill(fillColor(z));
        curveVertex(0, height);
        curveVertex(0, height);
        for (var i = 0; i < curves + 1; i++) {
            strokeWeight(0);
            x = (xDist+xDistOffset) * i;
            //initalY is portion of the screen the waves will cover,
            //yOffset is the change between each individual wave
            y = initialY + yOffset +(yPower * noise(t[z][i]));
            if (i==0){curveVertex(x, y + 10);}
            curveVertex(x, y);
            // strokeWeight(5);
            // point(x, y);
            t[z][i] += .005;
            
        }
        // strokeWeight(1);
        curveVertex(x, y);
        curveVertex(x, height);
        curveVertex(x, height);
        endShape();
        yOffset*=1.1 + 0.5 ;
        yPower*= 1.15;
        xDistOffset*=1.5;
    }
}

function draw() {
    if (width != windowWidth || height != windowHeight){
        width = windowWidth;
        height = windowHeight;
        createCanvas(width, height);
        curves = int(width/50);
    }
    
        
    background(skyColor);
    drawOcean();
    
}