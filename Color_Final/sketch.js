var width;
var height;
var curves;
var waveLayers = 13;
var t=[];
var initialY;
var skyColor;

var backgroundYellow;
var backgroundLightBlue;
var backgroundBlue;




function setup() {
    width = windowWidth;
    height = windowHeight;
    initialY = int(height*(2/3));
    var cnv = createCanvas(width, height);
    cnv.parent('myContainer');
    
    curves = int(width/50);
    skyColor = color(170, 240, 255);
    create2DNoiseList();
    

    backgroundYellow = color(255, 240, 201)
    backgroundLightBlue = color( 78, 210, 255)
    backgroundBlue = color(10, 45, 250);

    backgroundSunset = [backgroundBlue, backgroundYellow];

    
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

var colorBlue = {
    //blue
    'r': 10,
    'g': 45,
    'b': 250
}

var colorSkyBlue = {
    //light blue
    'r': 170,
    'g': 240,
    'b': 255
}


var colorLightBlue = {
    //light blue
    'r': 178,
    'g': 210,
    'b': 255
}

var colorGreen = {
     //dark green
    'r': 50,
    'g': 120,
    'b': 200
}

var colorPurple = {
    //purple
    'r': 177,
    'g': 135,
    'b': 188
}

var colorOrange = {
    // orange
    'r': 249,
    'g': 204,
    'b': 164
}

var colorRed = {
    //red
    'r': 201,
    'g': 92,
    'b': 116
}


var colorTeal = {
    //teal
    'r': 76,
    'g': 226,
    'b': 239
}

var colorLightYellow = {
    //teal
    'r': 255,
    'g': 240,
    'b': 201
}



var dayColorList = [colorGreen, colorTeal, colorLightBlue, colorBlue];

var sunsetColorList = [colorRed, colorOrange, colorLightYellow, colorLightBlue];

var twoDColorLists = [dayColorList, sunsetColorList];
var colorList = [colorGreen, colorTeal, colorLightBlue, colorBlue];

var backgroundList = [colorLightBlue, colorSkyBlue];
var twoDBackgroundList = [[colorLightBlue, colorSkyBlue], [colorBlue, colorLightYellow]];

function getTwean(c1, c2, progress, z) {
    //progress is 0 to 1
    var twean = {
    'r': 0,
    'g': 0,
    'b': 0
}

    var noiseOffset = noise(t[z][1])*80 - 20;
    twean.r = c1.r + (c2.r - c1.r)* progress + noiseOffset;
    twean.g = c1.g + (c2.g - c1.g)* progress + noiseOffset;
    twean.b = c1.b + (c2.b - c1.b)* progress + noiseOffset;
    return twean;
}

function getListTwean(c1, c2, progress) {
    //progress is 0 to 1
    var twean = {
    'r': 0,
    'g': 0,
    'b': 0
}
    
    twean.r = c1.r + (c2.r - c1.r)* progress;
    twean.g = c1.g + (c2.g - c1.g)* progress;
    twean.b = c1.b + (c2.b - c1.b)* progress;
    return twean;
}

function updateList(progress, timeIndex) {
    console.log(backgroundList);

    if (timeIndex == twoDBackgroundList.length - 1){
        backgroundList[0] = getListTwean(twoDBackgroundList[timeIndex][0], twoDBackgroundList[0][0], progress);
        backgroundList[1] = getListTwean(twoDBackgroundList[timeIndex][1], twoDBackgroundList[0][1], progress);
    }
    else{
        backgroundList[0] = getListTwean(twoDBackgroundList[timeIndex][0], twoDBackgroundList[timeIndex+1][0], progress);
        backgroundList[1] = getListTwean(twoDBackgroundList[timeIndex][1], twoDBackgroundList[timeIndex+1][1], progress);
    }
    for (var i = 0; i < colorList.length; i++) {
        
        if (timeIndex == twoDColorLists.length - 1){
        //to fade from last index/list to first index/list
            colorList[i] = getListTwean(twoDColorLists[timeIndex][i], twoDColorLists[0][i], progress);
        }
        else {
            //console.log(timeIndex, progress);
            colorList[i] = getListTwean(twoDColorLists[timeIndex][i], twoDColorLists[timeIndex + 1][i], progress);
        }
    }
    
}

function getTimeProgress(){
    // returns progress (0.0 - 1.0), the percentage between the lists in twoDColorLists
    return ((millis() / 100) % 100) * .01;
}

function getTimeIndex(){
    return int(((millis() / 100) % (100 * twoDColorLists.length)) * .01);
}


function fillColor(z){
    //color progression of the waves
    //z=0 is the furthest in space
    var hue = 20*z + 80;
    var saturation = 8 * (z);
    var brightness = 70 + (z*2.5);
    var hsbString='hsb('+str(hue)+','+str(saturation)+'%,'+str(brightness)+'%)';

    var index = int(z*((colorList.length -1)/waveLayers)); //index in colorList to get twean of
    var progressIndex = z % (waveLayers/(colorList.length - 1));
    var progress = progressIndex / (waveLayers/(colorList.length-1));

    var newTwean = getTwean(colorList[index], colorList[index+1], progress, z);
    var rgbString='rgb('+int(newTwean.r)+','+int(newTwean.g)+','+int(newTwean.b) +')';
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

function drawBackgroundGradient(x, y, w, h, color1, color2){
    //refrences code from https://p5js.org/examples/color-linear-gradient.html
    var c1 = color(color1.r, color1.g, color1.b);
    var c2 = color(color2.r, color2.g, color2.b);
    strokeWeight(1);
    for (var i = y; i <= y+h; i++) {
      var inter = map(i, y, y+h, 0, 1);
      var c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x+w, i);
    }
}

function draw() {
    if (width != windowWidth || height != windowHeight){
        width = windowWidth;
        height = windowHeight;
        createCanvas(width, height);

        curves = int(width/50);
    }
    var timeIndex = getTimeIndex();
    var timeProgress = getTimeProgress();

    updateList(timeProgress, timeIndex);
    drawBackgroundGradient(0, 0, width, initialY+ 25, backgroundList[0], backgroundList[1]);
    drawOcean();

    
    
    
}