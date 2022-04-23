// global constants
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence

// Global Variables
var pattern = [2, 2, 4, 3, 2, 1, 2, 4, 6, 5];

var numOfMistakes;
var numOfGuesses = 3;

var clueHoldTime = 1000; // initially how long to hold each clue's light/sound
var progress = 0;
var gamePlaying = false;
var guessCounter = 0;
var tonePlaying = false;
var volume = 0.5;

function startGame() {
  //initialize game variables
  progress = 0;
  numOfMistakes = 0;
  gamePlaying = true;

  // Randomize pattern of blocks to be used
  for (let i = 0; i < 10; i++) pattern[i] = Math.round(Math.random() * 6);

  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  playClueSequence();
}

function stopGame() {
  gamePlaying = false;
  // swap the Start and Stop buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
}

function lightButton(btn) {
  document.getElementById("button" + btn).classList.add("lit");
}
function clearButton(btn) {
  document.getElementById("button" + btn).classList.remove("lit");
}

function playSingleClue(btn) {
  if (gamePlaying) {
    lightButton(btn);
    playTone(btn, clueHoldTime);
    setTimeout(clearButton, clueHoldTime, btn);
  }
}

function playClueSequence() {
  guessCounter = 0;
  clueHoldTime *= 0.85;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for (let i = 0; i <= progress; i++) {
    // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
    setTimeout(playSingleClue, delay, pattern[i]); // set a timeout to play that clue
    delay += clueHoldTime;
    delay += cluePauseTime;
  }
}

function showImage(n) {
  document.getElementById("b" + n + "img").classList.remove("hidden");
}

function hideImage(n) {
  document.getElementById("b" + n + "img").classList.add("hidden");
}

function guess(btn) {
  console.log("user guessed the following input: " + btn);

  if (!gamePlaying) {
    return;
  }

  if (pattern[guessCounter] == btn) {
    // correct guess
    if (progress == guessCounter) {
      if (progress == pattern.length - 1) {
        // condition for a game win
        winGame();
      } else {
        // correct guess
        progress++;
        playClueSequence();
      }
    } else {
      //check the next guess
      guessCounter++;
    }
  } else {
    //incorect sequence
    numOfMistakes++;
    // game is lost
    if (numOfMistakes >= numOfGuesses) loseGame();
    // Game continues
    else
      alert(
        "You have " + (numOfGuesses - numOfMistakes) + " tries remaining before Ganon captures Zelda!"
      );
  }
}

function loseGame() {
  stopGame();
  alert("Game Over! Zelda was captured :(");
  resetHoldTime();
}

function winGame() {
  stopGame();
  alert("Game Over! You beat Ganon!");
  resetHoldTime();
}

function resetHoldTime() {
  clueHoldTime = 1000;
}

// Sound Synthesis Functions
const freqMap = {
  1: 233.08,
  2: 293.66,
  3: 349.23,
  4: 466.16,
  5: 587.33,
};
function playTone(btn, len) {
  o.frequency.value = freqMap[btn];
  g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
  context.resume();
  tonePlaying = true;
  setTimeout(function () {
    stopTone();
  }, len);
}
function startTone(btn) {
  if (!tonePlaying) {
    o.frequency.value = freqMap[btn];
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025);
    tonePlaying = true;
  }
}

function stopTone() {
  g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025);
  tonePlaying = false;
}

// Page Initialization
// Init Sound Synthesizer
var context = new AudioContext();
var o = context.createOscillator();
var g = context.createGain();
g.connect(context.destination);
g.gain.setValueAtTime(0, context.currentTime);
o.connect(g);
o.start(0);
