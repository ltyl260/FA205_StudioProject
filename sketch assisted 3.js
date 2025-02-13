// taken from "camera save photo" by joshmiller
// https://editor.p5js.org/joshmiller/sketches/HyyWhllFX
// trying to find differences between screenshot and live
// ## first issue: capturing the webcam ##
// p5js version works but VSCodium only holds the upper right corner of the selection...
//> issue was in the size of the capture, draw... needed to specify display size
//> mostly in the mouse pressed function when getting the hold image through
//> hold = capture.get(0, 0,capture.width,capture.height); needs to be adjusted to capture height...
// 
// ** now that thats fixed.. I need to find the differences between the hold image and the live capture...*
// ## second issue: traversing the capture ##
// from my test i have found that even with a pure black input the webcam values still fluctuate up to 11
// > text(str(capture.pixels[20] + ' is ' + hold.pixels[20] +' = '+ (capture.pixels[idx] != hold.pixels[idx])), 30,30);
//  so i will need to adjust my conditional brackest
// from if ((capture.pixels[idx] != hold.pixels[idx])&&(capture.pixels[idx+1] != hold.pixels[idx+1])&&(capture.pixels[idx+2] != hold.pixels[idx+2])){
// to if ((((hold.pixels[idx+0] - r) > capture.pixels[idx+0]) || (capture.pixels[idx+0] > hold.pixels[idx+0] + r))||(((hold.pixels[idx+1] - r) > capture.pixels[idx+1]) || (capture.pixels[idx+1] > hold.pixels[idx+1] + r))|| (((hold.pixels[idx+2] - r) > capture.pixels[idx+2]) || (capture.pixels[idx+2] > hold.pixels[idx+2] + r)))
// > made variable range because +- 25 ended up being a more reasonable range from my test

// ## third issue: continuous capture NOT generated by mouseclicks ##
// a wokring script for motion capture https://editor.p5js.org/bestesaylar/sketches/WFsPqG-8A by bestesaylar was helpful
// 

var video;
var scaler = 20; // how pixelated is the screen Very(20) - impossibly detailed (1); 
var preFrame;
var range = 100; // rnage for motion detection

function setup() {
  createCanvas(640, 480);
  pixelDensity(1);
  video = createCapture(VIDEO);
  video.size(width / scaler, height / scaler);
  video.hide();
  preFrame = createImage(video.width, video.height);
}

function draw() {
  // background(255);
  //image(capture, 0, 0, 320, 240); // show the live camera
  video.loadPixels();
  preFrame.loadPixels();// NEW from https://editor.p5js.org/bestesaylar/sketches/WFsPqG-8A
   
  for (let y = 0; y < video.height; y++) {
    for (let x = 0; x < video.width; x++) {
      var index = (x + y*video.width)*4;
      // ###################################################################################################### bestesaylar codelet pr = preFrame.pixels[index + 0];
      let pr = preFrame.pixels[index + 0];
      let pg = preFrame.pixels[index + 1];
      let pb = preFrame.pixels[index + 2];
      // let pbright = (pr + pg + pb) / 3; // makes a greyscale image

      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      // let bright = (r + g + b) / 3; // makes a greyscale image
			
      var diff = dist(r, g, b, pr, pg, pb); // https://p5js.org/reference/p5/dist/ dist achiebes what i was jankilly writing boolean statements for
			if (diff<range){ // if diference is within range
        fill(r,g,b);
      } else {
        fill(255, 0, 0);
      }
      noStroke();
      rect(x * scaler, y * scaler, scaler, scaler);
    }
  }

  preFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);// takes the current capture and loads it into preFarme for next iteration

}

