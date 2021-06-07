var canvas = document.getElementById("myCanvas");
var scale = Math.min(window.innerHeight / canvas.height, window.innerWidth / canvas.width);
var ctx = canvas.getContext("2d");
canvas.height = canvas.height * scale;
canvas.width = canvas.width * scale;
var x = 110 * scale; //starting position x
var y = canvas.height * 0.75; //starting position y
var dx = 0;
var dy = 0;
var musicPlaying = false;
var levelChangeColor = ["rgb(100, 100, 100)", "rgb(250, 250, 250)"]
var levelChangeText = "let's go"
var imageRepeat = [];
var pausex = 0;
var pausey = 0;
var select = 0;
var isMoving = false;
var levelChange = 0;
var isChanging = false;
var radius = 10 * scale; //character size
var pressedKeys = {}; //input checker
var acceleration = 7 *
  scale; //acceleration of character
var maxSpeed = 3 * scale; //max speed of character
var level = 4; //current level
var energyLoss = 2 * scale; //energy lost during collisions
var balfade = 0; //time measuring variable
var winAnimation = 0;
var winCoverMove = 0;
var curEnt = 0; //current entity being updated
var textSpacing = 1.2
var startScreenBackground = "rgb(200, 200, 200)"
var isPlaying = false;
var frame = 0;
var isFlashPlaying = true;
var flashFrame = 0;
var started = false;
var consolelog;
var darkBlue = "rgb(34, 39, 122)"
var blue = "rgb(102, 102, 255)"
var pink = "rgb(255, 102, 207)"
var lightBlue = "rgb(102, 204, 255)"
var green = "rgb(8, 242, 110)"
var darkGreen = "rgb(6, 125, 58)"
var lightGreen = "rgb(179, 252, 211)"
var red = "rgb(255, 100, 100)"
var darkRed = "rgb(207, 37, 37)"
var lightRed = "rgb(242, 172, 172)"
var grey = "rgb(144, 144, 144)"
var lightGrey = "rgb(212, 212, 212)"
var darkGrey = "rgb(72, 72, 72)"
var white = "white"
var music = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/backgroundmusic.mp3?raw=true')
var blockhit = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/blockhit.wav?raw=true');
var rumble = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/rumble.mp3?raw=true');
var switchChange = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/switch1.wav?raw=true');
var switchHit = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/switch2.wav?raw=true');
var death = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/death.wav?raw=true');
var indestructibleHit = new Audio('https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/hitindestructible.wav?raw=true');
var levels = [{
    X: [220 * scale], //x position of box
    Y: [160 * scale], //y position of box
    W: [40 * scale], //width of box
    H: [40 * scale], //height of box
    D: [0], //number of hits on box
    isBroke: [false],
    strength: [3],
    breakable: [true],
    indicator: ["hp"],
    startColor: [green],
    hitColor: [lightGreen],
    textColor: [darkGreen],
    color: [green],
    deadly: [false],
    functions: ["none"],
    sounds: [blockhit],
    eNum: 1, //number of boxes
    startX: 240 * scale,
    startY: 240 * scale,
    winMessages: ["wow you beat the\nfirst level"],
    deathMessages: ["impossible"]
  },
  {
    X: [0, 300 * scale, 0],
    Y: [140 * scale, 140 * scale, 50 * scale],
    W: [260 * scale, 180 * scale, 40 * scale],
    H: [40 * scale, 40 * scale, 40 * scale],
    D: [0, 0, 0],
    isBroke: [false, false, false],
    strength: [0, 0, 5],
    breakable: [false, false, true],
    indicator: ["none", "none", "hp"],
    startColor: [red, red, green],
    hitColor: [lightRed, lightRed, lightGreen],
    textColor: [white, white, darkGreen],
    color: [red, red, green],
    deadly: [true, true, false],
    functions: ["none", "none", "none"],
    sounds: [death, death, blockhit],
    eNum: 3,
    startX: 240 * scale,
    startY: 240 * scale,
    winMessages: ["did you figure out what the\nred blocks do?"],
    deathMessages: ["should've told you\nabout those"]
  },
  {
    X: [0, 220 * scale, 440 * scale, 0],
    Y: [140 * scale, 0, 140 * scale, 180 * scale],
    W: [40 * scale, 40 * scale, 40 * scale, 180 * scale],
    H: [40 * scale, 480 * scale, 40 * scale, 40 * scale],
    D: [0, 0, 0, 0],
    isBroke: [false, false, false, false],
    strength: [0, 0, 5, 0],
    breakable: [false, false, true, false],
    indicator: ["none", "none", "hp", "none"],
    startColor: [blue, red, green, grey],
    hitColor: [lightBlue, lightRed, lightGreen, lightGrey],
    textColor: [white, white, darkGreen, darkGrey],
    color: [blue, red, green, grey],
    deadly: [false, true, false, false],
    functions: [{
      name: toggleBreak,
      properties: 1
    }, "none", "none", "none"],
    sounds: ["switch", death, blockhit, indestructibleHit],
    eNum: 4,
    startX: 110 * scale,
    startY: 240 * scale,
    winMessages: ["i haven't made\nmore levels yet"],
    deathMessages: ["oof you loser"]
  },
  {
    X: [400 * scale, 360 * scale, 320 * scale, 320 * scale, 440 * scale, 360 * scale, 320 * scale, 400 * scale], //x position of box
    Y: [40 * scale, 40 * scale, 0, 40 * scale, 80 * scale, 160 * scale, 120 * scale, 120 * scale], //y position of box
    W: [80 * scale, 40 * scale, 40 * scale, 40 * scale, 40 * scale, 40 * scale, 40 * scale, 40 * scale], //width of box
    H: [40 * scale, 40 * scale, 40 * scale, 80 * scale, 120 * scale, 40 * scale, 40 * scale, 80 * scale], //height of box
    D: [0, 0, 0, 0, 0, 0, 0, 0], //number of hits on box
    isBroke: [false, false, false, false, false, true, false, false, false],
    strength: [3, 3, 3, 3, 3, 3, 3],
    breakable: [false, false, false, false, false, false, false, false, true],
    indicator: ["none", "none", "none", "none", "none", "none", "none", "none"],
    startColor: [grey, red, blue, grey, grey, red, pink, grey],
    hitColor: [lightGrey, lightRed, lightBlue, lightGrey, lightGrey, lightRed, lightBlue, lightGrey],
    textColor: [darkGrey, darkRed, darkBlue, darkGrey, darkGrey, darkRed, darkBlue, darkGrey],
    color: [grey, red, blue, grey, grey, red, pink, grey],
    deadly: [false, true, false, false, false, true, false, false],
    functions: ["none", "none", {
      name: [toggleBreak, toggleBreak, toggleColor],
      properties: [1, 5, {index: 6, color1: blue, color2: pink}]
    }, "none", "none", "none", {name: [breakBlock], properties: [5]}, "none"],
    sounds: [indestructibleHit, death, "switch", indestructibleHit, indestructibleHit, death, "switch", indestructibleHit],
    eNum: 8, //number of boxes
    startX: 460 * scale,
    startY: 20 * scale,
    winMessages: ["wow you're smart"],
    deathMessages: ["how are you going\nto get past that?"]
  },

  /*{
    X: [0, (160 - 20) * scale, (320 - 20) * scale, (160 - 20) * scale],
    Y: [0, (160 - 20) * scale, (160 - 20) * scale, (200 - 20) * scale],
    W: [canvas.width, 40 * scale, 40 * scale, 200 * scale],
    H: [40 * scale, 40 * scale, 40 * scale, 40 * scale],
    D: [0, 0, 0, 0],
    isBroke: [false, false, false, false],
    strength: [0, 3, 3, 3],
    breakable: [false, true, true, false],
    indicator: ["none", "hp", "hp", "none"],
    startColor: ["rgb(255, 100, 100)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(100, 100, 100)"],
    hitColor: ["rgb(250, 250, 250)", "rgb(150, 150, 150)", "rgb(150, 150, 150)", "rgb(200, 200, 200)"],
    color: ["rgb(255, 100, 100)", "rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(100, 100, 100)"],
    deadly: [true, false, false, false],
    functions: ["none", "none", "none", "none"],
    eNum: 4,
    startX: 240 * scale,
    startY: 240 * scale,
    winMessages: ["did you figure out what\nthe red blocks do?", "please don't leave i\npromise it gets harder", "you hear stone doors opening...\njk, here's the next level"],
    deathMessages: ["oof, maybe i should've\nwarned you about those", "haha, did you know you\n can die in this game?", "about those red blocks, um"]
  },
  {
    X: [430 * scale, 0 * scale, 380 * scale, 240 * scale],
    Y: [0 * scale, 0 * scale, 0 * scale, 150 * scale],
    W: [50 * scale, 50 * scale, 50 * scale, 240 * scale],
    H: [50 * scale, 50 * scale, 100 * scale, 50 * scale],
    D: [0, 0, 0, 0],
    isBroke: [false, false, false, false],
    strength: [5, 5, 5, 5],
    breakable: [true, true, false, false],
    indicator: ["hp", "hp", "none", "none"],
    startColor: ["rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(255, 100, 100)", "rgb(255, 100, 100)"],
    hitColor: ["rgb(150, 150, 150)", "rgb(150, 150, 150)", "rgb(250, 250, 250)", "rgb(250, 250, 250)", ],
    color: ["rgb(0, 0, 0)", "rgb(0, 0, 0)", "rgb(255, 100, 100)", "rgb(255, 100, 100)"],
    deadly: [false, false, true, true],
    functions: [{
      name: fixBlock,
      properties: 3
    }, {
      name: breakBlock,
      properties: 3
    }, "none", "none"],
    eNum: 4,
    startX: 32 * scale,
    startY: 288 * scale,
    winMessages: ["wow i'm so proud of you\nyou did the first level", "that wasn't too\nhard right?", "i don't even know what\nto type on these lol", "you won, that's cool ig"],
    deathMessages: ["placeholder message"]
  },*/


] //color variable for hit animation

/*
the variable levels below is a way to easily make new levels. The level properties are arranged in arrays, where index 0 would be box 1, index 1 would be box 2, etc. X is the x position of the box(es), Y is the y position of the box(es), W is the width of the box(es), H is the height of the boxes, D is the damage, or the amount of hits on each box, isBroke is a variable that tells whether or not the box is broke, please start this as false, strength is the amount of hits it takes to break each box, and enum is the only variable that isn't an array. This variable's purpose is to simply define the number of boxes on that level.

To make a new level, copy the following format into a new line on the levels variable. Then, fill in each property.

{
		X: [],										//x position of box
		Y: [],										//y position of box
		W: [],										//width of box
		H: [],										//height of box
		D: [0, 0],								//number of hits on the box, have each value be 0
		isBroke: [false, false],	//whether or not the box is broke, have each value be false
		strength: [],							//how many hits it takes to break the box
		breakable:	[],						//specify if the box is breakable or not
		indicator: [],						//does box show hits "hit", health "hp", or none "none"
		color: [],								//color of boxes, input should be string in this specific format "rgb(#r, #g, #b)"
		eNum: 0,									//number of boxes, adjust this to the amount of indexes in each array

	},
	
*/

function ImageCollection(list, callback) {
  var total = 0,
    images = {}; //private :)
  for (var i = 0; i < list.length; i++) {
    var img = new Image();
    images[list[i].name] = img;
    img.onload = function() {
      total++;
      if (total == list.length) {
        setInterval(update, 10);
      }
    };
    img.src = list[i].url;
  }
  this.get = function(name) {
    return images[name] || (function() {
      throw "Not exist"
    })();
  };
}


var images = new ImageCollection([{
  name: "blue",
  url: "https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/blueblock.png?raw=true"
}, {
  name: "purple",
  url: "https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/purpleblock.png?raw=true"
}, {
  name: "grey",
  url: "https://github.com/HitTheBrick/HitTheBrick.github.io/blob/main/greyblock.png?raw=true"
}, {
  name: "bongo cat",
  url: "https://i.pinimg.com/originals/46/9e/e2/469ee2b818c5a9e57ac1f730970b4372.png"
}]);

music.addEventListener('ended', function() {
  this.currentTime = 0;
  this.play();
}, false);

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
window.onkeyup = function(e) {
  pressedKeys[e.keyCode] = false;
}
window.onkeydown = function(e) {

  pressedKeys[e.keyCode] = true;
  if (e.keyCode == 38 && levelChange == 0) {
    select = select - 1;
  }
  if (e.keyCode == 40 && levelChange == 0) {
    select = select + 1;
  }
  if (e.keyCode == 13 && started == false) {
    isFlashPlaying = false;
    started = true;
    if (select == 0) {
      levelChange = 1;
    }
    if (select == 1) {
      levelChange = -1;
    }
  }
}

window.addEventListener('mousedown', e => {
  music.volume = 0.75;
  music.play();
});

window.onload = function() {
  music.volume = 0.75
  if (level - 1 >= 0) {
    x = levels[level - 1].startX;
    y = levels[level - 1].startY;
  }
  levelChange = level;
  dx = 0;

};

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  gameObjects();
  move();
}

function move() {
  if (isChanging === false && level > 0) {
    if (pressedKeys[38] && !pressedKeys[40]) {
      if (dy > -maxSpeed) {
        dy = dy - acceleration / 100;
      }
    } else if (pressedKeys[40]) {
      if (dy < maxSpeed) {
        dy = dy + acceleration / 100;
      }
    } else {
      if (dy > 0.2 * scale) {
        dy = dy - acceleration / 100;
      }
      if (dy < -0.2 * scale) {
        dy = dy + acceleration / 100;
      }
      if (Math.abs(dy) < 0.2 * scale) {
        dy = 0;
      }
    }
    if (pressedKeys[37] && !pressedKeys[39]) {
      if (dx > -maxSpeed) {
        dx = dx - acceleration / 100;
      }
    } else if (pressedKeys[39]) {
      if (dx < maxSpeed) {
        dx = dx + acceleration / 100;
      }
    } else {
      if (dx > 0.2 * scale) {
        dx = dx - acceleration / 100;
      }
      if (dx < -0.2 * scale) {
        dx = dx + acceleration / 100;
      }
      if (Math.abs(dx) < 0.2 * scale) {
        dx = 0;
      }
    }
    y = y + dy;
    x = x + dx;
    if (y < 0 + radius) {
      y = 0 + radius
      dy = -dy / energyLoss;
    }
    if (x < 0 + radius) {
      x = 0 + radius
      dx = -dx / energyLoss;
    }
    if (y > canvas.height - radius) {
      y = canvas.height - radius;
      dy = -dy / energyLoss;
    }
    if (x > canvas.width - radius) {
      x = canvas.width - radius;
      dx = -dx / energyLoss;
    }

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
    ctx.closePath();
  }
}

function gameObjects() {
  if (level == 0) {
    startScreen();
  } else if (typeof levels[level - 1] === "undefined") {
    level = 1;
  } else {
    for (i = 0; i < levels[level - 1].eNum; i++) {
      if (levels[level - 1].isBroke[i] == false) {
        let xPos = levels[level - 1].X[i];
        let yPos = levels[level - 1].Y[i];
        let width = levels[level - 1].W[i];
        let height = levels[level - 1].H[i];
        let curLevel = levels[level - 1]
        let damage = curLevel.D[i];
				

        ctx.beginPath();
        if (curLevel.startColor[i].charAt(0) != "@") {
          ctx.rect(xPos, yPos, width, height);
          ctx.fillStyle = curLevel.color[i];
          ctx.fill();
        }
        if (curLevel.startColor[i].charAt(0) == "@") {


          imageRepeat[0] = curLevel.startColor[i].substr(1, curLevel.startColor[i].indexOf(":") - 1);
          imageRepeat[1] = /[a-zA-Z]/.exec(curLevel.startColor[i]);
          imageRepeat[1] = imageRepeat[1].index;
          imageRepeat[1] = curLevel.startColor[i].substr(curLevel.startColor[i].indexOf(":") + 1, imageRepeat[1] - (curLevel.startColor[i].indexOf(":") + 1));

          for (p = 0; p < imageRepeat[0] * imageRepeat[1]; p++) {
            ctx.drawImage(images.get(curLevel.startColor[i].match(/[a-zA-Z]/g).join("")), xPos + (width / imageRepeat[0]) * (p % imageRepeat[0]), yPos + (height / imageRepeat[1]) * (Math.trunc(p / imageRepeat[0])), width / imageRepeat[0], height / imageRepeat[1]);
          }
        }
        ctx.font = "bold " + 20 * scale + "px Comic Sans MS";
        ctx.fillStyle = curLevel.textColor[i];
        ctx.textAlign = "center";
        if (curLevel.indicator[i] == "hp") {
          ctx.fillText("" + curLevel.strength[i] - curLevel.D[i], xPos + width / 2, yPos + height / 2 + 10 * scale);
        }
        if (curLevel.indicator[i] == "hit") {
          ctx.fillText("" + curLevel.D[i], xPos + width / 2, yPos + height / 2 + 10);
        }
        ctx.closePath();
        if (isChanging === false) {
          if (this.RectCircleColliding(curLevel, i) != 0) {
            if (curLevel.deadly[i] === true) {
              gameOver();
              break;
            }
            if (y > yPos && y < yPos + height) {
              if (x > xPos + width) {
                x = xPos + width + radius;
                if (Math.sqrt((dx ** 2) + (dy ** 2)) > 2.5 * scale && Math.abs(dy) <
                  Math.abs(dx)) {
                  hit(i);
                }
              }
              if (x <= xPos) {
                x = xPos - radius;
                if (Math.sqrt((dx ** 2) + (dy ** 2)) > 2.5 * scale && Math.abs(dy) <
                  Math.abs(dx)) {
                  hit(i);
                }
              }
              dx = -dx / energyLoss;
            } else if (x > xPos && x < xPos + width) {
              if (y > yPos + height) {
                y = yPos + height + radius;
                if (Math.sqrt((dx ** 2) + (dy ** 2)) > 2.5 * scale && Math.abs(dy) > Math.abs(dx)) {
                  hit(i);
                }
              }
              if (y < yPos) {
                y = yPos - radius;
                if (Math.sqrt((dx ** 2) + (dy ** 2)) > 2.5 * scale && Math.abs(dy) > Math.abs(dx)) {
                  hit(i);
                }
              }
              dy = -dy / energyLoss;
            }
            if (curLevel.D[i] >= curLevel.strength[i] && curLevel.breakable[i] == true) {
              curLevel.isBroke[i] = true;
            }
          }
          for (e = 0; e <= curLevel.eNum; e++) {
            if (curLevel.breakable[e] == true && curLevel.isBroke[e] == false) {
              break;
            }
            if (e == curLevel.eNum) {
              gameWin();
            }
          }
        }
      }
    }
  }
}

function RectCircleColliding(rect, i) {
  var distX = Math.abs(this.x - rect.X[i] - rect.W[i] / 2);
  var distY = Math.abs(this.y - rect.Y[i] - rect.H[i] / 2);
  if (distX > (rect.W[i] / 2 + radius)) {
    return false;
  }
  if (distY > (rect.H[i] / 2 + radius)) {
    return false;
  }
  if (distX <= (rect.W[i] / 2)) {
    return true;
  }
  if (distY <= (rect.H[i] / 2)) {
    return true;
  }
  var dx = distX - rect.W[i] / 2;
  var dy = distY - rect.H[i] / 2;
  return (dx * dx + dy * dy <= (radius * radius));
}

function blendColors(r1, g1, b1, r2, g2, b2, balance) {
  var bal = Math.min(Math.max(balance, 0), 1);
  var nbal = 1 - bal;
  return {
    r: Math.floor(r1 * nbal + r2 * bal),
    g: Math.floor(g1 * nbal + g2 * bal),
    b: Math.floor(b1 * nbal + b2 * bal)
  };
}

function animate1() {
  var ee = curEnt
  var startColor = levels[level - 1].startColor[ee].substr(4)
  startColor = startColor.slice(0, -1);
  var startColorArr = startColor.split(', ')
  var hitColor = levels[level - 1].hitColor[ee].substr(4)
  hitColor = hitColor.slice(0, -1);
  var hitColorArr = hitColor.split(', ')
  var bc = blendColors(hitColorArr[0], hitColorArr[1], hitColorArr[2],
    startColorArr[0], startColorArr[1], startColorArr[2], balfade);
  levels[level - 1].color[ee] = 'rgb(' + bc.r + ',' + bc.g + ',' + bc.b + ')';
  if (balfade < 1) {
    balfade += 0.1;
    requestAnimationFrame(animate1);
  }
}

function hit(i) {
  if (levels[level - 1].sounds[i] != "none" && levels[level - 1].sounds[i] != "switch") {
    levels[level - 1].sounds[i].play();
  }
  levels[level - 1].D[i] = levels[level - 1].D[i] + 1;
  curEnt = i;

  if (levels[level - 1].functions[curEnt] != "none") {
    //window["func_" + levels[level - 1].functions[curEnt].name](levels[level - 1].functions[curEnt].properties)
    for (u = 0; u < levels[level - 1].functions[curEnt].name.length; u++) {
      levels[level - 1].functions[curEnt].name[u](levels[level - 1].functions[curEnt].properties[u], i);
    }
  }

  balfade = 0;
  animate1();


}

function gameWin() {
  pausex = x;
  pausey = y;
  isChanging = true;
  dx = 0;
  dy = 0;
  winAnimation = 0;
  levelChangeColor[0] = "rgb(100, 100, 100)"
  levelChangeColor[1] = "rgb(250, 250, 250)"
  levelChangeText = levels[level - 1].winMessages[Math.random() * levels[level - 1].winMessages.length >> 0]
  levelChangeAnimate("rgb(100, 100, 100)");
  levelChange = level + 1;


}

function gameOver() {
  death.play();
  isChanging = true;
  pausex = x;
  pausey = y;
  winAnimation = 0;
  levelChangeColor[0] = "rgb(224, 60, 60)"
  levelChangeColor[1] = "rgb(252, 209, 214)"
  levelChangeAnimate();
  levelChangeText = levels[level - 1].deathMessages[Math.random() * levels[level - 1].deathMessages.length >> 0]
  levelChange = 1;


  dx = 0;
  dy = 0;
}

function levelChangeAnimate() {
  rumble.volume = 1;
  var txt = levelChangeText;
  var scaleText = 0;
  var txtlength = [];
  if (winAnimation < 1) {
    winCoverMove = canvas.width * winAnimation
    ctx.beginPath();
    ctx.arc(pausex, pausey, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
    ctx.closePath();
    isMoving = true;
    if (winAnimation > 0.9) {
      rumble.volume = 1 - (winAnimation - 0.9) * 10
      console.log(rumble.volume);
    }

    rumble.play();
  }
  if (winAnimation >= 1 && winAnimation < 1.05) {
    rumble.volume = 1;
    winCoverMove = canvas.width;

    if (level > 0) {
      changeLevel();
    } else {
      level = levelChange;
    }
    isMoving = false;
    rumble.pause();
    rumble.currentTime = 0;
  }
  if (winAnimation >= 1.05) {

    isMoving = true;
    winCoverMove = canvas.width * (2 - (winAnimation - 0.05));
    ctx.beginPath();
    ctx.arc(levels[level - 1].startX, levels[level - 1].startY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
    ctx.closePath();
    if (winAnimation > 1.95) {
      rumble.volume = Math.max(1 - (winAnimation - 1.95) * 10, 0);
      console.log(rumble.volume);
    }
    rumble.play();
  }
  ctx.beginPath();
  ctx.fillStyle = levelChangeColor[0];
  ctx.rect(0, 0, Math.max(winCoverMove, 0), canvas.height);
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  if (txt.charAt(0) != "@") {
    txt = txt.split("\n")
    ctx.font = 192 / txt.length * scale + "px Comic Sans MS";
    for (k = 0; k < txt.length; k++) {
      txtlength[k] = ctx.measureText(txt[k]).width;

    }
    var maxlength = txtlength.reduce(function(a, b) {
      return Math.max(a, b);
    });
    if (maxlength > 320 * scale) {
      scaleText = (320 * scale / maxlength)

    } else {
      scaleText = 1;
    }
    ctx.font = Math.ceil(192 / txt.length * scaleText * scale) + "px Comic Sans MS"


    ctx.fillStyle = levelChangeColor[1];
    for (j = 0; j < txt.length; j++) {
      ctx.fillText(txt[j], canvas.width / 2 + winCoverMove - canvas.width, (canvas.height / 2) + (ctx.font.match(/\d+/)[0] / 4) + (j - (txt.length - (txt.length / 2 + 0.5))) * (ctx.font.match(/\d+/)[0] * textSpacing));
    }
  } else if (txt.charAt(0) == "@") {
    txt = txt.replace("@", "")
    var scaleImage = Math.min(300 / images.get(txt).naturalWidth, 200 / images.get(txt).naturalHeight);

    ctx.drawImage(images.get(txt), canvas.width / 2 - (images.get(txt).naturalWidth * scaleImage * 0.5) + winCoverMove - canvas.width, canvas.height / 2 - (images.get(txt).naturalHeight * scaleImage * 0.5), images.get(txt).naturalWidth * scaleImage, images.get(txt).naturalHeight * scaleImage);
  }

  ctx.closePath()
  if (winAnimation < 2.05) {
    setTimeout(function() {
      window.requestAnimationFrame(levelChangeAnimate);
    }, 1);
    winAnimation += 0.01;
  } else {
    isChanging = false;
    isMoving = false;
    rumble.pause();
    rumble.currentTime = 0;
    y = levels[level - 1].startY;
    x = levels[level - 1].startX;
    dx = 0;
    dy = 0;
  }

}

function changeLevel() {
  levels[level - 1].isBroke.forEach(function(part, index, theArray) {
    theArray[index] = false;
  });
  levels[level - 1].D.forEach(function(part, index, theArray) {
    theArray[index] = 0;
  });
  levels[level - 1].color.forEach(function(part, index, theArray) {
    theArray[index] = levels[level - 1].startColor[index];
  });
  level = levelChange;
}

function toggleBreak(index, i) {
  switchChange.play();
	switchChange.currentTime = 0;
	if(levels[level-1].D[i] % 2 == 1) {
		changeColor(i, pink);
	} else {
		changeColor(i, blue);
	}
  if (levels[level - 1].isBroke[index] == false) {
    levels[level - 1].isBroke[index] = true;
  } else {
    levels[level - 1].D[index] = 0;
    levels[level - 1].isBroke[index] = false;
  }
}

function breakBlock(index, i) {
  if (levels[level - 1].isBroke[index] != true) {
    switchChange.play();
		changeColor(i, pink);
  } else {
    switchHit.play();
  }
  levels[level - 1].isBroke[index] = true;
  
}

function toggleColor(object, i) {
  switchChange.play();
	switchChange.currentTime = 0;
	if(levels[level-1].D[i] % 2 == 1) {
		changeColor(i, pink);
	} else {
		changeColor(i, blue);
	}
	console.log(object.color1)
  if (levels[level - 1].startColor[object.index] == object.color1) {
    levels[level - 1].startColor[object.index] = object.color2;
		levels[level - 1].color[object.index] = object.color2;
		console.log('dope')
  } else {
    levels[level - 1].startColor[object.index] = object.color1;
    levels[level - 1].color[object.index] = object.color1;
  }
}

function fixBlock(index, i) {
  if (levels[level - 1].isBroke[index] != false) {
    switchChange.play();
		changeColor(i, pink)
  } else {
    switchHit.play();
  }
  levels[level - 1].D[index] = 0;
  levels[level - 1].isBroke[index] = false;
  changeColor(i, blue);
}

function changeColor(index, color) {
  console.log(color);
  levels[level - 1].startColor[index] = color;
  levels[level - 1].color[index] = color;
}

function animateText() {
  isPlaying = true;
  frame = frame + 1;

  setTimeout(function() {
    isPlaying = false;
  }, 1000);
  if (levels == 0) {
    requestAnimationFrame(animateText)
  }
}

function flash() {
  var speed = 30
  isFlashPlaying = true;
  flashFrame = flashFrame + 1;

  if (flashFrame > 15) {
    speed = speed + (flashFrame - 15) * 20;
  }
  setTimeout(function() {
    isFlashPlaying = false;
  }, speed);
  if (levels == 0) {
    requestAnimationFrame(flash)
  }
}

CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x + r, y);
  this.arcTo(x + w, y, x + w, y + h, r);
  this.arcTo(x + w, y + h, x, y + h, r);
  this.arcTo(x, y + h, x, y, r);
  this.arcTo(x, y, x + w, y, r);
  this.closePath();
  return this;
}

function log() {


}

function startScreen() {
  if (isPlaying == false) {
    animateText();
  }
  ctx.beginPath();
  ctx.fillStyle = startScreenBackground
  ctx.rect(0, 0, canvas.width, canvas.height)
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineWidth = 10;
  if (frame % 2 == 0) {
    ctx.fillStyle = "rgb(250, 184, 255)"
  } else {
    ctx.fillStyle = "rgb(64, 64, 64)"
  }
  ctx.font = 'bold ' + 71 * scale + 'px Gloria Hallelujah';
  ctx.textAlign = "center";
  ctx.fillText('Break The', 237 * scale, 85 * scale);
  ctx.fillText('Brick', 237 * scale, 165 * scale);
  ctx.closePath();
  ctx.beginPath();
  ctx.font = 'bold ' + 71 * scale + 'px Gloria Hallelujah';
  ctx.textAlign = "center";
  if (frame % 2 == 0) {
    ctx.fillStyle = "rgb(240, 0, 255)"
  } else {
    ctx.fillStyle = "rgb(128, 128, 128)"
  }
  ctx.fillText('Break The', 240 * scale, 80 * scale);
  ctx.fillText('Brick', 240 * scale, 160 * scale);
  ctx.closePath();
  if (select < 0) {
    select = 1;
  }
  if (select > 1) {
    select = 0;
  }
  ctx.beginPath();
  if (select == 0 && flashFrame % 2 == 0) {
    ctx.fillStyle = "rgb(255, 252, 196)"
  } else {
    ctx.fillStyle = "rgb(64, 64, 64)"
  }
  ctx.roundRect(187 * scale, 193 * scale, 100 * scale, 40 * scale, 10 * scale).fill()
  ctx.closePath();
  ctx.beginPath();
  if (select == 1 && flashFrame % 2 == 0) {
    ctx.fillStyle = "rgb(255, 252, 196)"
  } else {
    ctx.fillStyle = "rgb(64, 64, 64)"
  }
  ctx.roundRect(187 * scale, 253 * scale, 100 * scale, 40 * scale, 10 * scale).fill()
  ctx.beginPath();
  if (select == 0 && flashFrame % 2 == 0) {
    ctx.fillStyle = "rgb(250, 237, 9)"
  } else {
    ctx.fillStyle = "rgb(128, 128, 128)"
  }
  ctx.roundRect((240 - 50) * scale, 190 * scale, 100 * scale, 40 * scale, 10 * scale).fill();
  ctx.closePath();
  ctx.beginPath();
  if (select == 1 && flashFrame % 2 == 0) {
    ctx.fillStyle = "rgb(250, 237, 9)"
  } else {
    ctx.fillStyle = "rgb(128, 128, 128)"
  }
  ctx.roundRect((240 - 50) * scale, 250 * scale, 100 * scale, 40 * scale, 10 * scale).fill();
  ctx.closePath();
  ctx.beginPath();
  if (select == 1 && flashFrame % 2 == 0) {
    ctx.fillStyle = "rgb(250, 237, 9)"
  } else {
    ctx.fillStyle = "rgb(128, 128, 128)"
  }
  ctx.font = "bold " + 30 * scale + "px Comic Sans MS"
  ctx.textAlign = "center"
  ctx.fillText("Play", 240 * scale, 220 * scale)
  ctx.closePath();
  ctx.beginPath();
  if (select == 0) {
    ctx.fillStyle = "rgb(250, 237, 9)"
  } else {
    ctx.fillStyle = "rgb(128, 128, 128)"
  }
  ctx.font = "bold " + 20 * scale + "px Comic Sans MS"
  ctx.textAlign = "center"
  ctx.fillText("Settings", 240 * scale, 275 * scale)
  ctx.closePath();
  if (flashFrame < 20) {
    if (isFlashPlaying == false) {
      flash();
    }
  }
  if (flashFrame == 20 && isChanging == false) {
    setTimeout(levelChangeAnimate, 1000);
    isChanging = true;
  }


}
setInterval(log, 1000);
