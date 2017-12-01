function Game () {
  
// ----------------------------------------------------------------------------------------------
// PROPERTIES - variables to hold game data
// ----------------------------------------------------------------------------------------------

  // Constants to hold game data
  this.wordList = ["DIREWOLF", "GUEST  RIGHT", "HARRENHAL", "IRON  PRICE", "KHALEESI", "LORD  OF  LIGHT", "UNSULLIED", "WHITE  WALKERS", "THE  WALL", "KINGS  LANDING", "BRAAVOS", "DORNE", "WESTEROS", "WINTERFELL", "RIVERRUN", "RED  WEDDING", "HOUSE  TYRELL", "HOUSE  STARK", "HOUSE  LANNISTER", "HOUSE  GREYJOY", "HOUSE  FREY", "HOUSE  BOLTON", "HOUSE  BARATHEON", "HOUSE  ARRYN", "HOUSE  MARTELL", "HOUSE  TARGARYEN", "HOUSE  TULLY", "SEVEN  KINGDOMS", "FREE  CITIES", "IRONBORN", "DROWNED  GOD", "DRAGONSTONE ", "CASTERLY  ROCK", "HIGHGARDEN", "RED  KEEP", "STORMS  END", "THE  EYRIE", "STORMLANDS", "THE  REACH", "THE  WESTERLANDS", "THE  NORTH", "IRON  ISLANDS", "THE  VALE", "ESSOS", "KINGSLAYER", "WILDLING", "MAD  KING", "THE  SEVEN", "DOTHRAKI ", "GREENSIGHT", "THE  OTHERS", "GODSWOOD", "CASTLE  BLACK", "ARMY  OF  THE  DEAD", "UNBOWED  UNBENT  UNBROKEN", "WINTER  IS  COMING", "FIRE  AND  BLOOD", "MAESTER", "MILK  OF  THE  POPPY", "PYROMANCER", "WILDFIRE", "WILDLING", "THE  LONG  NIGHT", "OLDTOWN", "THE  CITADEL", "HIGHTOWER", "SEPTON"];
  this.unusedIndices = []; // as words are selected from the wordList array, their index is removed from this list as a possible option for selection;
  this.symbol = "▢";
  this.symbolArray = [];
  this.symbolString = "";
  this.maxGuesses = 7;
  this.actionableGuesses = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

  // Variables to hold round-specific data
  this.selectedWord = "";
  this.lettersGuessed = [];
  this.wrongGuesses = [];
  this.guessesLeft = this.maxGuesses;

  // Ongoing stats for entire game
  this.roundNumber = 0; 
  this.winCount = 0;
  this.lossCount = 0;
  this.allPossibleLetters = [];
  this.winWords = []; // will store 2 pieces of info in objects; each object key/value pair = the word + how many wrong guesses
    // e.g. [ {'house tyrell': '2'}, {'winter is coming': 5} ] 
  this.lossWords = []; // will store just a series of the words the user didn't get in time
  this.allWrongGuesses = [];
  // An array to track all the letters correctly guessed on rounds the user loses
  this.allCorrectGuesses = [];

// ----------------------------------------------------------------------------------------------
// METHODS - functions to control game play 
// ----------------------------------------------------------------------------------------------

// Three methods to generate a keyboard (mainly for use on mobile)

// First, naming a method to dynamically generate letter buttons; this method will be called by name, rather than using an anonymous function
// (this will be called from the MAIN PROCESS section: e.g., this.actionableguesses.forEach( *call method here* )
this.generateButtons = value => { 
  const letterButton = `<button class="letter-button" class="out" id="${value}" > <span class="character" > ${value}  </span> </button>`;
  document.getElementById("keyboard").innerHTML += letterButton; 
}
// Second, naming/defining a method here to attach click handlers to each letter button
this.readLetter = event => { 
  console.log(`Clicked ${event.target.innerText} `);
  document.getElementById("clicked").innerHTML += `<span> ${event.target.innerText} </span>`
}

// Third, a method to serially attach click handlers, defined above, to each letter button
this.attachHandler = item => {item.addEventListener("click", this.handle ); }
// Finally, a method to call to execute the attachHandler method
this.processHandlers = buttonArray => { buttonArray.forEach( this.attachHandler ); }

// this.actionableGuesses.forEach( this.generateButtons );

this.updateHangmanImage = number => {
    if (window.innerHeight > window.innerWidth) {
      document.getElementById("hangman-image").style.backgroundImage=`url(assets/hangman-photos/square/square-${number}.png)`;
      // document.getElementById("hangman-image").src=`assets/hangman-photos/square/square-${number}.png`;
    }
    else {
      document.getElementById("hangman-image").style.backgroundImage=`url(assets/hangman-photos/landscape/landscape-${this.wrongGuesses.length}.png)`;
      // document.getElementById("hangman-image").src=`assets/hangman-photos/landscape/landscape-${this.wrongGuesses.length}.png`;
    }
    // document.getElementById("hangman-image").style.backgroundImage=`url(assets/hangman-images/Square-Generic-${number}.png)`;
  // $("#background-image").css( "background-image", `url(assets/${number}.png)` );
}

  this.filterLetters = function (wordOrPhrase) {

    // console.log("Taken in by .filterLetters method: " + wordOrPhrase);

    var filteredLetters = wordOrPhrase
        // return new array of each character from the string
        .split("")
        // return new array with inner spaces removed
        .filter(function(character){return character !== " "})
        // return new array with duplicate letters removed
        .filter(function(value,index,self){return index === self.indexOf(value);}); 
        // console.log(filteredLetters);
    
    // Concatenate the filtered letter array to the allPossibleLetters property 
        // console.log(this.allPossibleLetters);
    var combinedArrays = this.allPossibleLetters.concat(filteredLetters) 
        // console.log("Filtered letters variable: " + filteredLetters);
    this.allPossibleLetters = combinedArrays;
        // console.log("All tracked letters so far: " + this.allPossibleLetters);

  } // close filterLetters method

  // Method to update the list of available index positions still left int the word list for the remainder of a game
  this.loadWordIndices = function (value, index) {
    this.unusedIndices.push(index);
  }

  // Method to update/remove an index number (item) from the unusedIndices array when a word is randomly selected
  this.removeWordIndex = function (number) {
    // var usedIndexNumber = this.unusedIndices.indexOf(number); 
    // this.unusedIndices.splice(usedIndexNumber, 1);
    this.unusedIndices.splice(number, 1);
    // console.log("REMOVED INDEX " + number);
  }

  this.selectWord = function () {
    
    // Check # of words left
    // console.log("No of indices left: " + this.unusedIndices.length);    
    // console.log("Remaining index numbers: " + this.unusedIndices);

    //Generate a random number:
    var randomNumber = Math.floor((Math.random() * this.unusedIndices.length) );
    // console.log("Randomly generated number: " + randomNumber);

      // test if all the words have been used (in which case, game ends:)
      if (!(this.unusedIndices.length)) 
      {
        this.concludeGame();
        return;
      }    

    var wordIndex = this.unusedIndices[randomNumber];
    // console.log("NEW INDEX NO. TO BE PASSED: " + wordIndex);
    // console.log("----------------------------------");
    // IMPORTANT: Here, secret word/phrase is assigned to object's SELECTED WORD property:
    this.selectedWord = this.wordList[wordIndex];

    // console.log("Selected word: " + this.selectedWord);
    
    // Remove number from list of unused indices to ensure it's not chosen again
    var indexToRemove = this.unusedIndices.indexOf(wordIndex);
    this.removeWordIndex(indexToRemove);

  }; // close selectWord method  

  this.resetRoundData = function () {
    this.roundNumber++;
    this.guessesLeft = this.maxGuesses;
    this.lettersGuessed = [];
    this.wrongGuesses = [];
  } // close resetRoundData method 

  this.increaseRoundNumber = function () {
    this.roundNumber++;
  }; // close increaseRoundNumber method

  this.increaseLosses = function () {
    this.lossCount++;
  }; // close increaseLosses method

  this.increaseWins = function () {
    this.winCount++;
  }; // close increaseWins method

  this.decreaseGuessesLeft = function () {
    this.guessesLeft--;
  }; // close decreaseGuessesLeft method

  this.makeSymbolArray = function (word) {

    // Reset array to empty/blank:
    this.symbolArray = [];

    // Iterate through the selected word/phrase and append a symbol (or space) for each character onto the array 
    for (i = 0; i < word.length; i++) {
        if (word[i] === " ") 
        {
            this.symbolArray.push("    ");
        }
        else 
        {
            this.symbolArray.push(this.symbol)
        }
    } // close for loop

    // test/debug
    // console.log(this.symbolArray);

  }; // close makeSymbolArray method

  this.makeSymbolString = function (array) {
    // Reset the symbolString
    this.symbolString = "";

    // Iterate through array, concatenate the correponding string
    for (i = 0; i < array.length; i++) 
    {
        this.symbolString += String(array[i])
    } // close for loop

  }; // close makeSymbolString method

  this.revealLetters = function (letter) {

    // Compare the guessed letter against each character in the selected word; replace symbols if there's a match 

    for (i = 0; i < this.selectedWord.length; i++) 
    {
        if (letter === this.selectedWord[i])
        {
            this.symbolArray[i] = this.selectedWord[i]
        }
    }
  }; // close revealLetters method

  // Method that will track wrong guesses for display to user:
  this.recordWrongGuess = function(guess) {
    this.wrongGuesses.push(guess);
    this.allWrongGuesses.push(guess);
  }; // close recordWrongGuess method

  this.recordCorrectGuess = function(guess) {
    this.allCorrectGuesses.push(guess);
  }

  // Method that displays all current data/stats to users
  this.renderStats = function() {
    $("#round-number").html(this.roundNumber);    
    $("#symbol-string").html(this.symbolString);
    $("#word-to-guess").html(this.selectedWord);
    $("#wrong-guesses").html(this.wrongGuesses.join(" - "));
    $("#chances-left").html(this.guessesLeft);
    $("#win-count").html(this.winCount);
    $("#win-words").empty();
    this.winWords.forEach(renderWinWordsToScreen);
    $("#loss-count").html(this.lossCount);
    // $("#loss-words").empty();
    document.getElementById("loss-words").innerHTML = null;
    this.lossWords.forEach(renderLossWordsToScreen);
    this.updateHangmanImage(this.wrongGuesses.length);
    $("#summary-message").hide();
    $("#summary-data").hide();
  }; // close renderStats method 

  this.summarizeGame = function () {
    $("#round-data").hide();
    $("#image-card").hide();
    var totalLetterCount = this.allPossibleLetters.length;
    console.log("totalLetterCount: " + totalLetterCount);
    var correctLetterCount = this.allCorrectGuesses.length;
    console.log("correctLetterCount: " + correctLetterCount);
    var maxGuesses = (this.roundNumber * 10);
    console.log("maxGuesses: " + maxGuesses);
    var allWrongGuesses = this.allWrongGuesses.length;
    console.log("allWrongGuesses: " + allWrongGuesses);
    var summaryMessage = 
    `Out of ${totalLetterCount} possible letters across ${this.roundNumber} rounds, you got ${correctLetterCount} right (${ ( correctLetterCount / totalLetterCount ).toFixed(0) }% accuracy).
    <br> 
    <br> 
    Out of ${maxGuesses} maximum guesses across ${this.roundNumber} rounds, you guessed ${allWrongGuesses} wrong letters (${ ( allWrongGuesses / maxGuesses ).toFixed(0) }% failure rate).
    <br> 
    <br> 
    All in all, you won ${this.winWords.length} round(s) and lost ${this.lossWords.length}.`

    // parseFloat(sucessRate * 100).toFixed(0)+"%"}.
    console.log(summaryMessage);
    $("#summary-message").empty();
    $("#summary-message").append(summaryMessage);
    $("#summary-message").show();
  };

  this.startRound = function () {
    this.resetRoundData();
    this.selectWord();
    this.makeSymbolArray(this.selectedWord);
    this.makeSymbolString(this.symbolArray);
    this.filterLetters(this.selectedWord);
  };

  this.concludeGame = function () {
    this.renderStats();
    this.summarizeGame();
  }

}; // closes Game object definition

// Some named functions to be called by (callbacks passed to) forEach / filter / map / reduce methods (use case: game stats)

const renderLossWordsToScreen = element => {
  // $("#loss-words").append(element + "<br>");
  document.getElementById("loss-words").innerHTML += `${element} <br>`;
}

function renderWinWordsToScreen (element) {
  if ( element.tries === 1)
  {
    $("#win-words").append( ` ${element.wordWon} (${element.tries} wrong guess) <br> `);
    // console.log( ` ${element.wordWon} (${element.tries} wrong guess) <br> ` )
  }
  else
  {
    $("#win-words").append( ` ${element.wordWon} (${element.tries} wrong guesses) <br> `);
    // console.log( ` ${element.wordWon} (${element.tries} wrong guesses) <br> ` )
  }
}

// function updateHangmanImage(number) {
//   document.getElementById("background-image").style.backgroundImage=`url(assets/${number}.png)`;
//   // $("#background-image").css( "background-image", `url(assets/${number}.png)` );
// }

this.handleInput = event => {
    // store user's input in variable 'letter', make it lower case for consistentcy, and log it:
    var letter = String.fromCharCode(event.keyCode).toUpperCase();
    // console.log(letter);

    // Filter out non-alphabetic input
    if (game.actionableGuesses.indexOf(letter) < 0)
      {
        // alert("That's not a letter!");
        return;
      }

    // Filter out letters already guessed
    if (game.lettersGuessed.indexOf(letter) > -1 )
    {
        // alert("Already guessed this letter!");
        return;
    }

    // IF new/actionable guess
    if (game.lettersGuessed.indexOf(letter) < 0 ) 
    {
      game.lettersGuessed.push(letter); 
      
      // IF CORRECT
      if (game.selectedWord.indexOf(letter) > -1) 
      {
          game.recordCorrectGuess(letter);
          game.revealLetters(letter);
          game.makeSymbolString(game.symbolArray);
          game.renderStats();

          // Test if symbolString is equal to selectedWord yet (i.e. USER WINS)
          // If user WINS:
          if (game.symbolString === game.selectedWord)
          {
            // Record the win
            game.increaseWins();

            // Add object to array of winWords
            var wordWon = game.selectedWord;
            // console.log("wordWon: " + wordWon);
            var tries = game.wrongGuesses.length;
            // console.log("tries: " + tries);
            game.winWords.push( {"wordWon": wordWon ,"tries": tries  } )
            // game.winWords.forEach(function(element) {console.log("Word: "+ element.wordWon + ", Tries: "+ element.tries )})
            game.renderStats();

            // Prompt user to play again, or not, and call appropriate function
            var replay = confirm("You win! Play again?");
              if (replay) 
              { 
                game.startRound();
                game.renderStats(); 
              }
              else 
              { 
                game.renderStats();
                game.summarizeGame(); 
              }
          }
      } // close IF CORRECT block

      // IF INCORRECT
      else 
      {
          // Add letter to array containing wrong guesses
          game.recordWrongGuess(letter);

          // Decrement the chances left to guess the word/phrase
          game.decreaseGuessesLeft();

          // Update HTML
          game.renderStats();

          // Test if the user is out of chances to guess (i.e. USER LOSES)
          // If user LOSES
          if (!game.guessesLeft > 0) 
            {
              // Record the loss
              game.increaseLosses();

              // Add word to lossWords
              var lostWord = game.selectedWord;
              game.lossWords.push(lostWord);
              game.lossWords.forEach(function(element) {console.log("Word lost: " + element)});
              game.renderStats();

              // Prompt user to play again, or not, and call appropriate function
              var replay = confirm("Your watch has ended! \n Play again?");
                if (replay) 
                  { 
                    game.startRound(); 
                    game.renderStats();
                  }
                else 
                {
                   game.renderStats();
                   game.summarizeGame();
                }
            }
      }
    } // close IF INCORRECT block

}; // Closes handleInput method (MAIN EVENT LISTENER)

// ----------------------------------------------------------------------------------------------
// MAIN PROCESS 
// ----------------------------------------------------------------------------------------------

// Instantiate the Game object
var game = new Game ();

// Load word indices (make entire word list available)
// NOTE: two arguments need to be passed to the forEach array method here:
// 1st ARGUMENT: Callback function -- game.loadWordIndices -- define method of the Game prototype
// and then, because the underlying method/function definition uses "this" keyword, 
// a second argument ("thisArg") is required as a reference object (otherwise, the method's return value will be undefined)
// 2nd ARGUMENT: "thisArg" -- game -- the specific instantiation of the Game prototype whose data needs to be changed

game.wordList.forEach(game.loadWordIndices, game);

// Generate keyboard:

game.actionableGuesses.forEach(game.generateButtons);

// Two items needed for generating the keyboard:
game.nodelist = document.getElementsByClassName("letter-button");
game.buttons = Array.prototype.slice.call( game.nodelist );
game.processHandlers(game.buttons, game);


// var nodelist = document.getElementsByClassName("letter-button");
// var buttons = Array.prototype.slice.call( nodelist )
// // Finally, call the previously defined functions to attach the click handlers to each button:
// console.log(buttons);
// buttons.forEach( game.attachHandler );

// Start the first round:
game.startRound();
game.renderStats();


// EVENT LISTENER: Device orientation (selects correct path for vertical/portrait photo assets)
// Note that "orientationchange" and screen.orientation are unprefixed in the following
// code although this API is still vendor-prefixed browsers implementing it.
window.addEventListener("orientationchange", function() {

  // console.log("the orientation of the device is now " + screen.orientation.angle);

  if (window.matchMedia("(orientation: portrait)").matches) {
    document.getElementById("hangman-image").style.backgroundImage=`url(assets/hangman-photos/square/square-${this.wrongGuesses.length}.png)`;
    // document.getElementById("hangman-image").src=`assets/hangman-photos/square/square-${this.wrongGuesses.length}.png`;
  }

  if (window.matchMedia("(orientation: landscape)").matches) {
    document.getElementById("hangman-image").style.backgroundImage=`url(assets/hangman-photos/landscape/landscape-${this.wrongGuesses.length}.png)`;
    // document.getElementById("hangman-image").src=`assets/hangman-photos/landscape/landscape-${this.wrongGuesses.length}.png`;
  }

}); // closes orientation change (window) event listener

// EVENT LISTENER: UI KEYBOARD INPUT (should call next event listener)

// EVENT LISTENER: PYSICAL KEYBOARD INPUT (BASIC GAME ENGINE)
document.onkeyup = game.handleInput; 

