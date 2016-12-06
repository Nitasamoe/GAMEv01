// "strict mode"
//INPUT=========================================================================
var worldSetup = [
  [false,true ,true ,true ,true ,false,true ,false,true ,true ,false,false,false,false,false,true ,true  ],
  [false,false,true ,true ,true ,true ,true ,true ,true ,true ,true ,true ,false,false,false,true ,true  ],
  [false,true ,true ,false,true ,true ,false,true ,true ,true ,true ,true ,true ,true ,true ,true ,false ],
  [false,true ,true ,true ,true ,true ,true ,true ,true ,true ,true ,false,false,true ,false,false,false ],
  [false,false,false,false,false,true ,false,false,true ,true ,false,false,false,true ,false,false,false ],
  [false,false,false,false,false,false,false,false,false,true ,true ,true ,true ,true ,true ,true ,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ]
]
var sizeBox = 50;

var marioInput = {
  speedValue  : 1,
  jumpValue   : 30,
  sizeValue   : 40
}


//============================END OF INPUT=======================================
//===============================================================================
function setup() {//=========Start SETUP=========================================
  createCanvas(worldSetup[0].length*sizeBox, worldSetup.length*sizeBox)
  frameRate(60);
// Setting up Box constructor
  function Box(x,y){
    this.top = y*sizeBox;
    this.bottom = y*sizeBox+sizeBox;
    this.right = x*sizeBox+sizeBox;
    this.left = x*sizeBox;
  }
// Setting up array for boxes
  boxArr = [];
// creating the boxes and filling them into the BoxArr
  for(var x = 0; x < worldSetup[0].length ; x++){
    for(var y = 0; y < worldSetup.length ; y++){
      if(worldSetup[y][x]===false){
        (function(){ var box = new Box(x,y); boxArr.push(box);  })();
      }
    }
  }
// Establish constructor for mario
  function Mario(){
    this.pos    = createVector(sizeBox/2,sizeBox/2);
    this.size   = marioInput.sizeValue;
    this.inAir  = false;
    this.vel    = createVector(0,0);
    this.acc    = createVector(0,0);
    this.display= function(){ ellipse(this.pos.x, this.pos.y, this.size) };
    this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
    this.colPoints; // arr of the four points of the hit box
    // method to establish the four Points of hitBox
    this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
  }
  mario = new Mario() // create Mario from the constructor
}//=========END SETUP==========================================================
//=============================================================================
function draw(){//=========Start DRAW==========================================
// Setup FORCES----------------------------------------------------------
  gravity = createVector(0,1);
//WORLD BUILDING---------------------------------------------------------
   worldBuilding();
//MARIO BUILDING-----------------------------------------------
  mario.vel.mult(0); // throw velocity bck to zero
  //Move Mario------------------------------------------------------
  mario.acc.add(gravity); // add gravity to mario
  mario.vel.add(mario.acc); // add acceleration to velocity
  mario.acc.limit(10); // limit the velocity to 10
  mario.pos.add(mario.vel); // add the velocity to the position
// Question Collision-------------------------------------------------
  mario.collisionPointsSetup(); // establish the hit box through four points of mario
  mario.collide(); // check if there is a collision and correct the posiiton
// RENDER MARIO-----------------------------------------------------
  mario.display();
//change acceleration based on the pressed key
  if(keyIsPressed===true){
    if(keyCode === RIGHT_ARROW){
      mario.acc.add(createVector(marioInput.speedValue,0));
    }
    if(keyCode === LEFT_ARROW){
      mario.acc.add(createVector(-marioInput.speedValue,0))
    }
  }
} // Ende draw();==============================================================
//=============================================================================
// Establish the function for creating the four points of our HitBox
function createCollisionPoints(pos,size){
    var arr = [];
    arr.push({pos:createVector(pos.x+size/2,pos.y),name:"right"})
    arr.push({pos:createVector(pos.x,pos.y-size/2),name:"top"})
    arr.push({pos:createVector(pos.x-size/2,pos.y),name:"left"})
    arr.push({pos:createVector(pos.x,pos.y+size/2),name:"bottom"})
    return arr;
}
function collision(boxArr,posArr){
  var boxes = boxArr;
  var hitPoints = posArr;
  var where = [];
   for(var i=0; i< boxes.length; i++){ // go through all the boxes
          // loop through all the ColPoints of mario
          for(var j =0; j < hitPoints.length; j++){
                if(hitPoints[j].pos.y > boxes[i].top && hitPoints[j].pos.y < boxes[i].bottom){
                  if(hitPoints[j].pos.x > boxes[i].left && hitPoints[j].pos.x < boxes[i].right){
                    (function(){ where.push({name:hitPoints[j].name,box:boxes[i]});})()
                  }
                }
          }// End of for loop thourgh hit points
  } // End of For Loop through boxes
  establishAntiForce(where);
}
function establishAntiForce(boxes){
  var boxes = boxes;
  for(var i=0; i<boxes.length;i++){
    if(boxes[i].name === "bottom"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.y = boxes[i].box.top-mario.size/2;
       mario.inAir = false;
    }
    if(boxes[i].name === "top"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.y = boxes[i].box.bottom+mario.size/2;
    }
    if(boxes[i].name === "left"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.x = boxes[i].box.right+mario.size/2;
    }
    if(boxes[i].name === "right"){
      antiForce = createVector(mario.acc.x*-1,mario.acc.y*-1);
       mario.vel.add(antiForce);
       mario.pos.x = boxes[i].box.left-mario.size/2;
    }
  }
}
function keyReleased(){
  mario.acc.mult(0);
}
function keyPressed(){
  //Control jump
      if(keyCode === UP_ARROW && mario.inAir === false){
        mario.acc.add(createVector(0,-marioInput.jumpValue));
        mario.inAir = true;
      }
}
function worldBuilding(){
  background(255,255,255);
  translate(-mario.pos.x+ width/2,0);
// Setup black squares ------------------------------------------
  for(var x = 0; x < worldSetup[0].length ; x++){
    for(var y = 0; y < worldSetup.length ; y++){
      if(worldSetup[y][x]===false){
        // Start Punkt links Oben
        (function(){
            fill(0,0,0);
            rect(x*sizeBox,y*sizeBox,sizeBox,sizeBox);
            })()
      }
    }
  }
}
