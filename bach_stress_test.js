

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
 for your pleasure you can stop the sounds using the space bar, 
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
// Keeps track of loaded images (true or false)
var loadStates = [imgCount]; 
// For loading animation
var loaderX, loaderY, theta;
var still = false;
//how many divisions are done
var times = 0;

function setup() {
  initAudio();

  createCanvas(900, 514);
  loadImages();

  initRects();
  
  textSize(12);
}

function draw() {
  if (checkLoadStates()) background(255);
  else {
    fill(0, 20);
    rect(0, 0, width, height);
  }

  // Start loading animation
  runLoaderAni();
  //check if images are loaded
   updateLoadStates();

  // When all images are loaded draw them to the screen
  if (checkLoadStates()) {
    for (var i = 0; i < allRects.length; i++) {
      allRects[i].display();
    }
  }
    fill(0);
    rect(0, height-20, width, height);
    
    fill(255, 0, 0);
    text(allRects.length+" buffer(s) playing, Processing running at "+nf(frameRate(), 2, 2)+" fps", width- 300, height-5);
  
}




function mousePressed() {
  
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
  } else 
  {
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
  if (key == 's'|| key== 'S') {
    still = !still;
    
    for (var i = 0; i < allRects.length; i++) {
      allRects[i].setStill(still);
    }
  }

  if (key == ' ') {
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
  for (var i = 0; i < 8; i++) { 
    images[i] = loadImage("data/canone_V2_0"+i+".png");
  }
}

function initRects() {
  allRects = [1];
  allRects[0]=new DrawingRect(images, 0, 0, width, height-20);
}

// Loading animation
function runLoaderAni() {
  // Only run when images are loading
  if (!checkLoadStates()) {
    fill(255);
    ellipse(loaderX, loaderY, 10, 10);
    loaderX = width/2 + cos(theta) * width/32;
    loaderY = height/2 + sin(theta) * (height/16);
    theta += PI/22;
  }
}

// Return true when all images are loaded - no false values left in array 
function checkLoadStates() {
  for (var i = 0; i < images.length; i++) {
    if (loadStates[i] == false) {
      return false;
    }
  }
  
  return true;
}

function updateLoadStates(){
  for (var i = 0; i < images.length; i++){
    // Check if individual images are fully loaded
    if ((images[i].width != 0) && (images[i].width != -1)){
      // As images are loaded set true in boolean array
      loadStates[i] = true;
    }
  }
}