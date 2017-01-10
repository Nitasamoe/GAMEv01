// "strict mode"
//INPUT=========================================================================
var worldSetup = [
  [false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,true ,true ,true ,true ,false,true ,false,true ,true ,false,false,false,false,false,true ,true  ],
  [false,false,true ,true ,true ,true ,true ,true ,true ,true ,true ,true ,false,false,false,true ,true  ],
  [false,true ,true ,false,true ,true ,false,true ,true ,true ,true ,true ,true ,true ,true ,true ,false ],
  [false,true ,true ,true ,true ,true ,true ,true ,true ,true ,true ,false,false,true ,false,false,false ],
  [false,false,false,false,false,true ,false,false,true ,true ,false,false,false,true ,false,false,false ],
  [false,false,false,false,false,false,false,false,false,true ,true ,true ,true ,true ,true ,true ,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
  [false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false ],
]
var sizeBox     = 35,
    marioInput  = {
        speedValue  : 1,
        jumpValue   : 22,
        sizeValue   : 30
    }
var mario;
function preload() {
      imgBlock = loadImage("block.png");
      imgBlock2 = loadImage("block2.png");
      ghostFront = loadImage("ghostFront.png");
      ghostLeft = loadImage("ghostLeft.png");
      ghostRight = loadImage("ghostRight.png");
    }
var garbArray = [];
var timeSpeed = 100;
var worldClock = {
    day : 0,
    hou : 0,
    min : 0,
    sec :0
}
var gameover = false;
var blockHeight = 0;
var worldHeight;
var worldWidth;
var lastPos={
  x:0,
  y:0
}
//============================END OF INPUT=======================================
//===============================================================================
function setup() {//=========Start SETUP=========================================
  createCanvas(worldSetup[0].length*sizeBox, worldSetup.length*sizeBox)
  frameRate(60);
  worldHeight = worldSetup.length*sizeBox;
  worldWidth = worldSetup[0].length*sizeBox;
// Setup Game Clock
  setInterval(function(){
    worldClock.sec += 1;
    blockHeight += 0.5;
    if(worldClock.sec === 60){worldClock.sec = 0;worldClock.min += 1
                                garbArray.push(new Garbage(lastPos.x,lastPos.y));
                              }
    if(worldClock.min === 60){worldClock.min = 0;worldClock.hou += 1}
    if(worldClock.hou === 60){worldClock.hou = 0;worldClock.day += 1}
    if(worldClock.sec%40===0){lastPos.x = mario.pos.x;lastPos.y = mario.pos.y;}

  },timeSpeed);
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
    this.display= marioDisplay;
    this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
    this.colPoints; // arr of the four points of the hit box
    // method to establish the four Points of hitBox
    this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
    this.amIdead = amIdead;
    this.looks = true;
  }
// Establish Garbage constructor
  function Garbage(x,y){
    this.pos    = createVector(x,y);
    this.size   = 10;
    this.vel    = createVector(0,0);
    this.acc    = createVector(0,0);
    this.display= function(){ ellipse(this.pos.x, this.pos.y, this.size) };
    this.collide= function(){var colP = this.colPoints; collision(boxArr, colP)};
    this.colPoints; // arr of the four points of the hit box
    // method to establish the four Points of hitBox
    this.collisionPointsSetup = function(){this.colPoints = createCollisionPoints(this.pos,this.size);};
    this.exist = true;
  }
  mario = new Mario() // create Mario from the constructor
}//=========END SETUP==========================================================
//=============================================================================
function draw(){//=========Start DRAW==========================================
// Setup FORCES----------------------------------------------------------
  gravity = createVector(0,1);
//WORLD BUILDING---------------------------------------------------------
   worldBuilding();
   blockRender();
   renderGarbage();
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
  mario.amIdead();
// RENDER MARIO-----------------------------------------------------
  mario.display();
  blockRender();
//change acceleration based on the pressed key
  if(keyIsPressed===true && gameover === false){
    if(keyCode === RIGHT_ARROW){
      mario.acc.add(createVector(marioInput.speedValue,0));
      mario.looks = false;
    }
    if(keyCode === LEFT_ARROW && gameover === false){
      mario.acc.add(createVector(-marioInput.speedValue,0));
      mario.looks = true;
    }
  }
} // Ende draw();==============================================================
//=============================================================================
function blockRender(){
  // RENDER BLOCK THAT RISES=====================================================
  fill(180,20,20,100);
  quad(0 , worldHeight-blockHeight , worldWidth , worldHeight-blockHeight , worldWidth , worldHeight , 0 , worldHeight);
}
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
      if(keyCode === UP_ARROW && mario.inAir === false && gameover === false){
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
            // fill(0,0,0,10);
            image(imgBlock2,x*sizeBox,y*sizeBox,sizeBox,sizeBox);

        })()

      }
    }
  }
}
function amIdead(){
  if(mario.pos.y > worldHeight-blockHeight){
    textSize(80);
    fill(0,0,0)
    text("Game Over", mario.pos.x-250, mario.pos.y);
    gameover = true;
  }
}
function renderGarbage(){
  for(var i = 0 ; i<garbArray.length ; i++){
      garbArray[i].display();
      if(p5.Vector.dist(mario.pos, garbArray[i].pos)<10){garbArray.splice(i,1);blockHeight-=10}
  }
}
function marioDisplay(){
  if(mario.acc.x === 0){
    image(ghostFront,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === true){
    image(ghostLeft,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  } else
  if(mario.looks === false){
    image(ghostRight,mario.pos.x-mario.size/2,mario.pos.y-mario.size/2,mario.size,mario.size);
  }
}
