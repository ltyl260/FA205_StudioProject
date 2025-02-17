*link: https://ltyl260.github.io/FA205_StudioProject/*
# interQUACKtivity: aka FA205_StudioProject
my vision is to have various ways to have webcam capture produce ducks, ideally like at teh tip of your fingers you are a fairy-duck-mother and sprinkle ducks everywhere you want.
It would be cool to be more like *Golan Levin* and have different motions or gestures create diferent ducks or tragectories of duck, or how big the ducks are but well see how progress goes.


# Progress Log #
taken from "camera save photo" by joshmiller
https://editor.p5js.org/joshmiller/sketches/HyyWhllFX
trying to find differences between screenshot and live
## first issue: capturing the webcam ##
p5js version works but VSCodium only holds the upper right corner of the selection...
> issue was in the size of the capture, draw... needed to specify display size
> mostly in the mouse pressed function when getting the hold image through
> hold = capture.get(0, 0,capture.width,capture.height); needs to be adjusted to capture height...

** now that thats fixed.. I need to find the differences between the hold image and the live capture...*
## second issue: traversing the capture ##
from my test i have found that even with a pure black input the webcam values still fluctuate up to 11
> text(str(capture.pixels[20] + ' is ' + hold.pixels[20] +' = '+ (capture.pixels[idx] != hold.pixels[idx])), 30,30);
 so i will need to adjust my conditional brackest
from if ((capture.pixels[idx] != hold.pixels[idx])&&(capture.pixels[idx+1] != hold.pixels[idx+1])&&(capture.pixels[idx+2] != hold.pixels[idx+2])){
to if ((((hold.pixels[idx+0] - r) > capture.pixels[idx+0]) || (capture.pixels[idx+0] > hold.pixels[idx+0] + r))||(((hold.pixels[idx+1] - r) > capture.pixels[idx+1]) || (capture.pixels[idx+1] > hold.pixels[idx+1] + r))|| (((hold.pixels[idx+2] - r) > capture.pixels[idx+2]) || (capture.pixels[idx+2] > hold.pixels[idx+2] + r)))
> made variable range because +- 25 ended up being a more reasonable range from my test

## third issue: continuous capture NOT generated by mouseclicks ##
a wokring script for motion capture https://editor.p5js.org/bestesaylar/sketches/WFsPqG-8A by bestesaylar was helpful
and my issue was not knowing how to store the images which has been fixed by bestesaylars working sketch
## fourth step: ducks! ## 
instead of the motion showing up as red pixels id like to have ducks appear
this requires reusing my duck class and fitting it to this purpose. Initialising a duck will only require x and y positions, i am not worrying about a duck existing for longer than movement is detected at this stage they will just appear instead of the pixels, size will be set with the scalar just like the pixels are in the example
the fill from the ducks eyes was turning the rest of the duck white because of the order in which thing were called... that was fun 2hrs to fix...
> fill(255, 0, 0); // for some reason if this is ontop of the call to redDuck the red becomes white.. weird... because of teh eye whites being last in the showduck constructor call...

### forth issue: ducks arent appearing at desire x,y points ###
i have manually multiplied the x and y by factors of 4 - 
looks like the loops traverse the size of the capture and not the size of the screen, multiply by scaler to fix :)
worked it out! since we divide our image by a scaler and we are only traversing this reduced image then we only get the x and y points of this reduced image, by multiplying by the scaler we remove this issue!
### could be nice: to make the window more adaptable ###
https://www.youtube.com/watch?v=a_6ggdvsIYE also had some ideas spefically abut fititng the window height and width! look into this for adaptability... mobile etc...
however its not immediately working so I will leave that for another project as its not essential to my ideal resolution.

### fifth issue: longevity of ducks ###
If I want the movements of the viewer to make traces from their movement ill need to remember where the movement has been...
I created new arrays and variables
>let xmoved = []; to store x position of points that have moved
>let ymoved = []; to store y position of points that have moved
>let compx; to store x position of points that have moved
>let compy; to store y position of points that have moved
this was taking forever to load...
I added another variable and array with the hopes of only saving THE most moved point and then 'tracing' that. 
>let diffmoved = []; to store total diff of points that have moved
>let compdiff; to store total of the greatest diff that has moved
although this didnt work as planned so ill have to work further on this idea.
>if (diff>range){
>   xmoved.push(x*scaler);
>   ymoved.push(y*scaler);
>   diffmoved.push(diff);
I added all moving points to their arrays if they passed the diff threshold
and then I went through that array *with the intention of* only displaying the most moved points
>compdiff = diffmoved[0];
>compx = xmoved[0];
>compy = ymoved[0];
>for (v =1; v<=xmoved.length; v++){
>   if(diffmoved[v]>compdiff){
>      compdiff = diffmoved[v];
>      compx = xmoved[v];
>      compy = ymoved[v]; 
>   }
>   redDuck = new Duck(compx,compy);
>   redDuck.show();
>}
That was the intention but it seems to get some randome points upon intitialisation and then does not add any further points, also its still adding points to the array so it takes forever.
I need to take the most moved point within the inital (diff>range) if loop to avoid unnecessary work for the sketch.
#### why didnt this work?: ####
because im taking several ducks within the loop and repoalcinging them over and over...
> I need to have a list of ducks (external to the draw function) that i append to each time the draw function detects movement.
> upon each iteration i will find the most moves pixel, storing the greatest value in comx,compy,compdiff. 
> AFTER i have looked through all the pixels and then i add them to the xmoved,ymoved and diff moves arrays.
> important to assign compdiff to equal 0 in early draw function, needs to be redefined every iteration!
> ALSO i made the choice to only multiply the x and y values by the scaler required for them to be displayed at the correct screen location until they are drawn as ducks, this saves extra caluclations that dont really matter for this use but it was a consideration made...

### now that it works with 1 duck! ###
>I can finally focus on flipping the camera so it refelcts the viewer like a mirror and its alot less confusing to interact with!
>>translate(width,0); scale(-1,1); //flip the camera to be less confusing https://editor.p5js.org/js6450/sketches/ls5ETAfd0  
what if i make it work with teh 5 most moved ducks?
>my first thought was to have a global variable for number of ducks i look at
>var duckcount = 5;
but it occured to me that it would be easiest to have compx,compy and compdiff also as arrays but to set the size!
> compdiff = [0]; 
> compx = [0];
> compy = [0];
> for (n = 0; n < duckcount; n++){ // initialise the comparison arrays to have the correct amount of spaces.
>    compx.push(0);
>    compy.push(0);  
>    compdiff.push(0);
> }
this way i can have the comparison variables as arrays to traverse but also i can chnage the number of ducks saved per iteration with a single variable duckcount! also this resets the comparison array each iteration!!!
*note: for duck count to reflect the number of ducks pusshed each iteration needed to change my initialising for loop:
> for (n = 0; n < duckcount-1; n++){ // initialise the comparison arrays to have the correct amount of spaces.*

### ducks appear even if not moving... ###
the sensitivity of the range for movement combined with scalar for the capture resolution and the initial amount of ducks all combine to affect the initial state of ducks on the screen. 
in a blank setting no ducks will show up but as soon as theres colour and movement at least 1 duck will pop up but i think this adds to the sketch so im not ging to work hard to undo it.
the only issue i have with it is one duck that upon initialisation likes to generate at 0,0 before any motion has been captured, i have hardcoded the soloution...
>for (let idx = 0; idx < xmoved.length; idx++){  
>  if (xmoved[idx]!=0 && ymoved[idx]!=0){   
>    redDuck = new Duck(xmoved[idx]*scaler,ymoved[idx]*scaler);
>    redDuck.show();
>  }
>} 

### Maybe i can embrace this variability by allowing the user to ineract with it! ###
https://p5js.org/reference/p5/createSlider/
i can have 3 sliders for range, scalar and duckcount!
> text('a:'+a+', b:'+b+', c:'+c,20,20)
from this i can see that *a: 255, b: 255, c:255* the sliders go between 0 ans 255
**range** goes between 0(high sensitivity)-255(no sensitivity)
> so rangeSlider can simply be set to the value of a;
**duckCount** slows things down a tonne at 100, so ill start with a cap at 50 ducks
> since duckCount will go between 0-50 ans the slider goes from 0-255
> so duckCountSlider can be ((b*50)/255);
**scalar** goes between Very(20) - impossibly detailed (1)
we CANNOT have c = 0 as the sketch will not work, even at 1 the sketch will run WAY too slowly
>so we will have an effective rnage of 5 - 20
>and let scalarSlider = int((c/255)*15+5);
upon second thought messing with the scalar isnt a good idea it leads to the same issue of the ducks not being in the 
>*note: the range is inversely proportional to the sketches sensitivity to motion so i need to change that*
>>**range** goes between 0(high sensitivity)-255(no sensitivity)
>> so rangeSlider can simply be set to the value of **255 - a**;

### Arrays not stacks ###
i tried to use my arrays like a stack, popping and pushing them, push technically worked but upon inquiring into why pop wasnt working looks like p5.js has geared it more towards graphic functions and i honestly got stacks and arrays mixed up in my head
*yay time to fix all my comparison array assignments...*
>xmoved.push(compx[n]);                                                                              //#
>ymoved.push(compy[n]);                                                                              //#
>diffmoved.push(compdiff[n]); 
>>append(xmoved,compx[n]);                                                                       //#
>>append(ymoved,compy[n]);                                                                       //#
>>append(diffmoved,compdiff[n]);
now using shift i can "pop" teh forst element off teh array by shifting its contents to the left
