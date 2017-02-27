/*

 bach stress test
 
 code: http://www.giovannibedetti.com/
 illustration: https://www.behance.net/monocolo
 
 README!
 
 This is a stress test for Processing and Web Audio API.
 The canvas is drawn using Processing and the sound is made with Web Audio API.
 At mouse click the image will be divided in 4 images.
 Also the audio file is split in 4 parts and these are played together. Parts 1 and 3 are played forward, while parts 2 and 4 are played backwards.
 
 You'll see and hear 1, 4, 16, 64, 256, 1024 images and sounds together.
 
 The theme is the famous J.S. Bach canon 1 à 2 from the "Musical Offering" (1747)
 This piece is a "crab canon", so it can be played at the same time forward and backward.
 See here (www2.nau.edu/tas3/MOcancrizans.pdf) for the full story.
 This test was made just to find out if it can be combined in other ways. 
 
 Check out the magic of math.
 
 Desktop only: 
 for your pleasure you can stop the sounds pressing 'p', 
 and enable/disable the random image change pressing 's'.
 
 Warning: as I said, this is a stress test. Try it at your own risk! (your browser can hang a little bit)
 
 If your browser supports Web Audio API, you will hear the full Bach theme on load. On iOS devices, this could not be true, because autoplay is disabled.
 
 02/2015
 */

var maxRecursion = 5; //max subdivision of rects, change it at your own risk
var fullRect;
var allRects;
var imgCount = 8;
var images = [imgCount];
var still = false;
//how many divisions are done
var times = 0;
//the div containing this canvas
var sketchParent;

function preload(){
  loadImages();
}

function windowResized() {
  resizeCanvas(sketchParent.offsetWidth, sketchParent.offsetHeight);
  stopSound(allRects.length);
  initRects();
  times = 0;
  still = false;
  createBuffers(1);
  playAtIndex(0);
}

function setup() {
  initAudio();
  sketchParent = document.getElementById("sketch-holder");
  var canvas = createCanvas(sketchParent.offsetWidth, sketchParent.offsetHeight);
  canvas.parent('sketch-holder');

  initRects();
  textSize(12);
  canvas.mousePressed(onMousePressed);
}

function draw() {
  background(255);
  for (var i = 0; i < allRects.length; i++) {
        allRects[i].display();
    }
  //draw some info about the test
  fill(0);
  rect(0, height-20, width, height);
  fill(255, 0, 0);
  text(allRects.length+" buffer(s) playing, Processing running at "+nf(frameRate(), 2, 2)+" fps", width-300, height-5);  
}

function onMousePressed() {/*mobile chrome fires mousePressed twice, wait for p5.js fix*/
  if (times >= 0) {
    still = true;
  }
  if (times < maxRecursion) {

    stopSound(allRects.length);

    divideRects();
    times++;

    createBuffers(allRects.length);

    for (var i=0; i < allRects.length; i++) {
      playAtIndex(i);
    }
  } else {
    background(255);
    stopSound(allRects.length);
    initRects();
    times = 0;
    still = false;
    createBuffers(1);
    playAtIndex(0);
  }
}

function keyPressed() {
  if (key=='s'||key=='S') {
    still = !still;
    for (var i = 0; i < allRects.length; i++) {
      allRects[i].setStill(still);
    }
  }
  if (key=='p'||key=='P') {
    stopSound(allRects.length);
  }
}

function divideRects() {
  var tempRects = [4];
  var newRects = [allRects.length*4];

  for (var i = 0; i < allRects.length; i++) {
    tempRects = allRects[i].divide();
    //copy tempRects to newRects
    for (var j = 0; j < tempRects.length; j++) {
      newRects[(i * 4) + j] = tempRects[j];
    }
  }
  allRects = newRects;
}  

function loadImages() {
  for (var i=0; i<imgCount; i++) { 
    images[i] = loadImage("data/canone_V2_0"+i+".png");
  }
}

function initRects() {
  allRects = [1];
  allRects[0] = new DrawingRect(images, 0, 0, width, height-20);
}