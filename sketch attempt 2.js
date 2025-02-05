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
// // ## third issue: dark spots and the loading box## 
// // now that its detecting chnages my issues are 
// // > the boxes being black (and not the pixel colours that have changed)
// // > the loading screeen half full of a box when loading
// third issue continuous

var capture;
var hold;

function setup() {
  createCanvas(800, 800);
  capture = createCapture(VIDEO);
  pixelDensity(0.4); // adding t see if it fexes issue, not a factor
  capture.hide();
  // make a new blank image
  hold = createImage(320, 240);
  dif = 0;
  r = 50;
}

function draw() {
  background(255);
   // show the live camera
   image(capture, 0, 0, 320, 240);
   capture.loadPixels();
   // draw the screen shot
   image(hold, 400, 0, 320,240); // need to speficy size too..
   hold.loadPixels();
   //text(capture.pixels[100],100,100);
   fill(255,255,255);
  //  text(str(capture.pixels[20] + ' is ' + hold.pixels[20] +' = '+ (capture.pixels[idx] != hold.pixels[idx])), 30,30);
  //  text(dif, 10,10);

  for (let x = 0; x < 320; x++){
    for (let y=0; y< 240; y++){
      idx = (x + y*capture.width)*4;

      if ((((hold.pixels[idx+0] - r) > capture.pixels[idx+0]) || (capture.pixels[idx+0] > hold.pixels[idx+0] + r))||(((hold.pixels[idx+1] - r) > capture.pixels[idx+1]) || (capture.pixels[idx+1] > hold.pixels[idx+1] + r))|| (((hold.pixels[idx+2] - r) > capture.pixels[idx+2]) || (capture.pixels[idx+2] > hold.pixels[idx+2] + r)))        {
        dif ++;
        fill(capture.pixels[idx+0],capture.pixels[idx+1],capture.pixels[idx+2]);
        rect(x,y,2,2);
      }
    }
  }
 
}

function mousePressed() {
	// copy the image from the live feed and put it in hold
  // hold = capture.get(0, 0, 320, 240); // this is what was wrong...
  hold = capture.get(0, 0,capture.width,capture.height);

  
	// restart the camera so it keeps showing the live feed
  capture = createCapture(VIDEO);
}