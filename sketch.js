// *link: https://ltyl260.github.io/FA205_StudioProject/*
// # interQUACKtivity: aka FA205_StudioProject

var video;
var scaler = 15; // how pixelated is the screen Very(20) - impossibly detailed (1); 
var duckScaler = 20;
var preFrame;
var range = 50; // range for motion detection 0(high sensitivity)-255(no sensitivity)
let xmoved = [0];
let ymoved = [0];
let diffmoved = [0];
let compdiff;
let compx;
let compy;
var duckcount = 10; //100 runs slow!
let rangeSlider;
let duckCountSlider;
let scalarSlider;
var maxDucks = 200;

class Duck {
  constructor(x,y){
    // duck pos x and y
    this.x = x;
    this.y = y;
    // duck movement gradient
    this.t = random(0,10);
    this.u = random(0,10);
    // ducks rgb colour variables
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.l = duckScaler;// unit length to standardise the size of the ducks
    this.grows = 1; //operator to control zoom fucntion
    this.z = random(width/6); //zoom variable for duck zoom rate
  }
  show(){
    // body
    stroke(this.r,this.g,this.b);
    fill(this.r,this.g,this.b);
    circle(this.x,this.y,this.l);
    circle(this.x+(4.5*this.l/5),this.y+(4*this.l/5),this.l);
    ellipse(this.x+(2*this.l/5),this.y+this.l,this.l*2,this.l+(this.l/5));
    //bill
    stroke(this.g, this.b, abs(this.r+100));
    fill(this.g, this.b, abs(this.r+100));
    ellipse(this.x-(2*this.l/5),this.y,(3*this.l/5),this.l/5);
    ellipse(this.x-(1.5*this.l/5),this.y-(this.l/10),(1.5*this.l/5),this.l/10);
    // duck eyes
      //eye white
    stroke(0,0,0);
    fill(0,0,0);
    circle(this.x+(this.l/5),this.y-(this.l/10),(1.1*this.l/5));
      // eye black
    stroke(255,255,255);
    fill(255,255,255);
    circle(this.x+(1.2*this.l/5),this.y-(1*this.l/5),this.l/10);
  }
  move(){
    // movement conditions duck 1
    this.x += this.t;
    if (this.x > width || this.x < 0){
      this.t = this.t * -1;
    }
    this.y += this.u;
    if ((this.y > height || this.y < 0)){ 
      this.u = this.u * -1;
    }
   }
  colour(r,g,b){
    // let pixelColour = webcam.get(this.x,this.y);
    // this.r = pixelColour[0];
    // this.g = pixelColour[1];
    // this.b = pixelColour[2];
    this.r = r;
    this.g = g;
    this.b = b;
  }
  size(g){
    this.l = g;
  }
  zoom(a,b, increment = 1){ 
    // start size (a) must be smaller than stop size (b)
    if (this.grows == 1){
      if (this.l < b){
        this.l += increment;     
      }  
    } 
    if (this.grows == -1) {
      if (this.l > a){
        this.l += -increment;  
      }
    }
    if (this.l >= b || this.l <= a){
      this.grows = this.grows * -1;
    }
  }
  animate(){
    this.move();
    this.colour();
    this.zoom(this.z,this.z+random(10));
    this.show();
  }
}

function setup() {
  createCanvas(640, 500);
  pixelDensity(1);
  capture = createCapture(VIDEO);//for better definition for interactions
  capture.hide(); // hide it
  video = createCapture(VIDEO);
  video.size(width / scaler, height / scaler);
  video.hide();
  preFrame = createImage(video.width, video.height);
  let redDuck = Duck;
  //##### SLIDER/TITLE SETUP #########################//
  // let rangeSlider ;                                //
  rangeSlider = createSlider(0, 255,100);             //
  rangeSlider.position(50, height);                   //
  rangeSlider.size(80);                               //  
  text('sensitivity to motion',(40),height-3);        //
  // let duckCountSlider;                             //  
  duckCountSlider = createSlider(0, 255,51);          //
  duckCountSlider.position((width-125), height);      //
  duckCountSlider.size(80);                           //
  text('motion points captured',(width-150),height-3);//
  // // let scalarSlider; REMOVED messes with duck pos//
  // scalarSlider = createSlider(0, 255,255/2.6);     //
  // scalarSlider.position(width-90, height);         //
  // scalarSlider.size(80);                           //
  // text('scalar',((width-65)),height-3);            //
  // // TITLE;                                        //
  textSize(15); textFont('Times New Roman');          //
  //https://p5js.org/reference/p5/textFont/           //
  fill(255,255,0); stroke(0,0,0); strokeWeight(4);    //
  text('interQUACKtivity',265, height-7);             //
  //##################################################//
}

function draw() {
  //######## DRAW SLIDERS #################################//
  let a = rangeSlider.value(); // assign slider variables  //
  let b = duckCountSlider.value();                         //
  // let c = scalarSlider.value(); REMOVED                 //
  range = 255-a; // assign slider values!                  //
  duckcount = int((b*50)/255);                             //
  //scaler = int((c/255)*15+5); REMOVED                    //
  //#######################################################//
  //######## DRAW CAMERA CAPTURE #############################################################//
  translate(width,0); scale(-1,1);                                                            //
  //flip the camera to be less confusing https://editor.p5js.org/js6450/sketches/ls5ETAfd0    //
  image(capture, 0, 0); // show the live camera                                               //                                                
  video.loadPixels();                                                                         //
  preFrame.loadPixels();// NEW from https://editor.p5js.org/bestesaylar/sketches/WFsPqG-8A    //
  //##########################################################################################//
  //####### comparison variables re-initialised ##########################//
  compdiff = [0];                                                         //
  compx = [0];                                                            //
  compy = [0];                                                            //
  // initialise the comparison arrays to have the correct amount of spaces//
  for (n = 0; n < duckcount-1; n++){                                      //
    append(compx,0);                                                      //
    append(compy,0);                                                      //
    append(compdiff,0);                                                   //                                                            //
  }                                                                       //
  //######################################################################//
  //######## TRAVERSE VIDEO TO DETECT MOTION #######################################//
  for (let y = 0; y < video.height; y++) {                                          //
    for (let x = 0; x < video.width; x++) {                                         //
      var index = (x + y*video.width)*4;                                            //
      //**********************************bestesaylar code*/                        //
      let pr = preFrame.pixels[index + 0];                                          //
      let pg = preFrame.pixels[index + 1];                                          //
      let pb = preFrame.pixels[index + 2];                                          //
      // let pbright = (pr + pg + pb) / 3; // makes a greyscale image               //
      let r = video.pixels[index + 0];                                              //
      let g = video.pixels[index + 1];                                              //
      let b = video.pixels[index + 2];                                              //
      // let bright = (r + g + b) / 3; // makes a greyscale image                   //
      var diff = dist(r, g, b, pr, pg, pb);                                         //
      // https://p5js.org/reference/p5/dist/                                        //
      // this achieves what I was otherwise jankilly writing boolean statements for //
			//*****************************************************/                      //
      if (diff>range){                                                              //
        // // create moving ducks within range                                      //
        // redDuck = new Duck(x*scaler,y*scaler);                                   //
        // redDuck.show(); // show ducks within range                               //
        for (let n = 0; n < compx.length; n++){ // traverse the comparison array    //
          if (diff >= compdiff[n]){                                                 //
            // > upon each iteration i will find the most moved pixel,              //
            // storing the greatest value in comx,compy,compdiff.                   //    
            compdiff[n] = int(diff);                                                //  
            compx[n] = int(x);                                                      //
            compy[n] = int(y);                                                      //
            //needs to break so as not to overwrite the same pixel into the code    //
            break;                                                                  //
          } 
        }                                                                           //                                           
      }                                                                             // 
    }                                                                               // 
  }                                                                                 //
  //################################################################################//
  //######## ADD MOST MOVED POSITIONS TO MOVED ARRAYS ##################################################### 
  for (let n = 0; n < compx.length; n++){ // traverse the comparison array                              //#
    // AFTER ive looked through all the pixels and then i add to the xmoved,ymoved and diff moves arrays//#
    // xmoved.push(compx[n]);                                                                           //#
    // ymoved.push(compy[n]);                                                                           //#
    // diffmoved.push(compdiff[n]);                                                                     //#
    append(xmoved,compx[n]);                                                                            //#
    append(ymoved,compy[n]);                                                                            //#
    append(diffmoved,compdiff[n]);                                                                      //#
    if (xmoved.length > maxDucks){                                                                      //#
      xmoved.shift();                                                                                   //#
      ymoved.shift();                                                                                   //#
      diffmoved.shift();                                                                                //#
    }                                                                                                   //#
  }                                                                                                     //#

  //######## takes the current capture and loads it into preFarme for next iteration ############
  preFrame.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);     //#

  //######## now that i have assigned the positions of most moved positions I can draw the ducks#
  for (let idx = 0; idx < xmoved.length; idx++){                                              //#
    if ((xmoved[idx]!=0 && ymoved[idx]!=0)&&(ymoved[idx]<video.height-3)){                    //#
      redDuck = new Duck(xmoved[idx]*scaler,ymoved[idx]*scaler);                              //#
      redDuck.show();                                                                         //#
    }
  }
  
  //******** test text ****************************************************************************
  // translate(width,0); scale(-1,1); //flip the camera to be less confusing https://editor.p5js.org/js6450/sketches/ls5ETAfd0
  // text(xmoved[0]+', '+ymoved[0],20,20)
  // text('a:'+range+', b:'+duckcount+', c:'+scaler,20,20)

}




