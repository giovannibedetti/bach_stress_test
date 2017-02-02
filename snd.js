var context, 
bufferLoader, 
panner, 
finalGain, 
compressor, 
audioFile,  
audioFileArray = [], 
nChan, 
channels = [];

function initAudio() {

  if ('webkitAudioContext' in window || 'AudioContext' in window) {
    console.log('Your browser DOES support Web Audio API');
    context = new webkitAudioContext() || AudioContext() || mozAudioContext || oAudioContext || msAudioContext;

    var p = navigator.platform;

    console.log(p);
    
    if ( p === 'iPad' || p === 'iPhone' || p === 'iPod' ) {
      bufferLoader = new BufferLoader(
      context, ["data/bach_canon_harp.aac", 

      ], finishedLoading
        );
    } else {
      bufferLoader = new BufferLoader(
      context, ["data/bach_canon_harp.mp3", 
      ], finishedLoading
        );
    }

    bufferLoader.load();
  } else {
    alert('Your browser does not support Web Audio API');
  }
}

function initAudioChain(bufferList) {

  finalGain = context.createGain();
  compressor = context.createDynamicsCompressor();
  compressor.treshold = 0;
  compressor.ratio = 20;

  audioFile = context.createBufferSource();

  audioFile.buffer = bufferList[0];
  nChan = audioFile.buffer.numberOfChannels;
  channels = [];

  for (var i = 0; i < nChan; i++) {
    channels[i] = new Float32Array(audioFile.buffer.getChannelData(i));
  }

  compressor.connect(context.destination);
}

function finishedLoading(bufferList) {
  console.log("finished loading!");

  initAudioChain(bufferList);
  createBuffers(1);
  playAtIndex(0);
}

function createBuffers(indexMax) {

  for (var index = 0; index < indexMax; index++) {

    var len;

    if (indexMax === 1) {
      len = audioFile.buffer.length;
    } else {

      len = Math.floor(audioFile.buffer.length / ( Math.pow(2, ( getBaseLog(2, Math.sqrt(indexMax)) + (getBaseLog(2, Math.sqrt(indexMax)) - 1) ) )));
    }

    var tempIndx = len * Math.floor(index / 2);

    var newBuffer = context.createBuffer(nChan, len, audioFile.buffer.sampleRate);
  
    for (var i = 0; i < nChan; i++) {

      var tempBuffer = new Array(len);
      for (var k = 0; k < tempBuffer.length; k++) {
      //if index is even the buffer is written forward
        if ((index % 2) === 0) {
          tempBuffer[k] = channels[i][tempIndx + k];
          //if index is odd the buffer is written backwards
        } else {
          tempBuffer[k] = channels[i][tempIndx + len - k];
        }
      }
      //tempBuffer is saved in newBuffer
      newBuffer.getChannelData(i).set(tempBuffer);
    }

    audioFileArray[index] = context.createBufferSource();
    audioFileArray[index].buffer = newBuffer;
    audioFileArray[index].loop = true;

    
    var panner = context.createPanner();
    panner.panningModel = "equalpower";
    var xPos;
    if (indexMax === 1) xPos = 0;
    else xPos = mapRange(index, 0, indexMax, -1, 1);
    panner.setPosition(xPos, 0, 0);
    
    audioFileArray[index].connect(panner);
    panner.connect(compressor);
  }
}

function playAtIndex(index) {
  audioFileArray[index].start(0);
}

function stopSound(indexMax) {

  for (var i = 0; i < indexMax; i++) {
    audioFileArray[i].stop(0);
  }
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function mapRange(value, low1, high1, low2, high2) {
  return low2+(high2 - low2) * (value - low1) / (high1 - low1);
}

