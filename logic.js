function Game () {
  
// ----------------------------------------------------------------------------------------------
// PROPERTIES - variables to hold game data
// ----------------------------------------------------------------------------------------------

  // Constants to hold game data
  this.wordList = ["DIREWOLF", "GUEST  RIGHT", "HARRENHAL", "IRON  PRICE", "KHALEESI", "LORD  OF  LIGHT", "UNSULLIED", "WHITE  WALKERS", "THE  WALL", "KINGS  LANDING", "BRAAVOS", "DORNE", "WESTEROS", "WINTERFELL", "RIVERRUN", "RED  WEDDING", "HOUSE  TYRELL", "HOUSE  STARK", "HOUSE  LANNISTER", "HOUSE  GREYJOY", "HOUSE  FREY", "HOUSE  BOLTON", "HOUSE  BARATHEON", "HOUSE  ARRYN", "HOUSE  MARTELL", "HOUSE  TARGARYEN", "HOUSE  TULLY", "SEVEN  KINGDOMS", "FREE  CITIES", "IRONBORN", "DROWNED  GOD", "DRAGONSTONE ", "CASTERLY  ROCK", "HIGHGARDEN", "RED  KEEP", "STORMS  END", "THE  EYRIE", "STORMLANDS", "THE  REACH", "THE  WESTERLANDS", "THE  NORTH", "IRON  ISLANDS", "THE  VALE", "ESSOS", "KINGSLAYER", "WILDLING", "MAD  KING", "THE  SEVEN", "DOTHRAKI ", "GREENSIGHT", "THE  OTHERS", "GODSWOOD", "CASTLE  BLACK", "ARMY  OF  THE  DEAD", "UNBOWED  UNBENT  UNBROKEN", "WINTER  IS  COMING", "FIRE  AND  BLOOD", "MAESTER", "MILK  OF  THE  POPPY", "PYROMANCER", "WILDFIRE", "WILDLING", "THE  LONG  NIGHT", "OLDTOWN", "THE  CITADEL", "HIGHTOWER", "SEPTON"];
  this.symbol = "_ ";
  this.symbolArray = [];
  this.symbolString = "";
  this.maxGuesses = 10;
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
  this.winWords = []; // will store 2 pieces of info in objects; each object key/value pair = the word + how many wrong guesses
    // e.g. [ {'house tyrell': '2'}, {'winter is coming': 5} ] 
  this.lossWords = []; // will store just a series of the words the user didn't get in time

// ----------------------------------------------------------------------------------------------
// METHODS - functions to control game play 
// ----------------------------------------------------------------------------------------------

  this.resetRoundData = function () {
    this.roundNumber++;
    this.guessesLeft = this.maxGuesses;
    this.lettersGuessed = [];
    this.wrongGuesses = [];
    this.renderStats();
  } // close resetRoundData method 

  this.increaseRoundNumber = function () {
    this.roundNumber++;
    this.renderStats();
  }; // close increaseRoundNumber method

  this.increaseLosses = function () {
    this.lossCount++;
    this.renderStats();
  }; // close increaseLosses method

  this.increaseWins = function () {
    this.winCount++;
    this.renderStats();
  }; // close increaseWins method

  this.decreaseGuessesLeft = function () {
    this.guessesLeft--;
    this.renderStats();
  }; // close decreaseGuessesLeft method

  this.makeSymbolArray = function (word) {

    // Reset array to empty/blank:
    this.symbolArray = [];

    // Iterate through the selected word/phrase and append a symbol (or space) for each character onto the array 
    for (i = 0; i < word.length; i++) {
        if (word[i] === " ") 
        {
            this.symbolArray.push(" ");
        }
        else 
        {
            this.symbolArray.push(this.symbol)
        }
    } // close for loop

    // test/debug
    console.log(this.symbolArray);

  }; // close makeSymbolArray method

  this.makeSymbolString = function (array) {
    // Reset the symbolString
    this.symbolString = "";

    // Iterate through array, concatenate the correponding string
    for (i = 0; i < array.length; i++) 
    {
        this.symbolString += String(array[i])
    } // close for loop

    // // test/debug
    // console.log(this.symbolString);

    this.renderStats();

  }; // close makeSymbolString method

  this.selectWord = function () {
    
    // Randomly select the secret word/phrase 
    this.selectedWord = this.wordList[Math.floor((Math.random() * this.wordList.length) + 1)];
    console.log(this.selectedWord);

  }; // close selectWord method

  this.revealLetters = function (letter) {

    // Compare the guessed letter against each character in the selected word; replace symbols if there's a match 

    for (i = 0; i < this.selectedWord.length; i++) 
    {
        if (letter === this.selectedWord[i])
        {
            this.symbolArray[i] = this.selectedWord[i]
        }
    }
    this.renderStats();
  }; // close revealLetters method

  // Method that will track wrong guesses for display to user:
  this.recordWrongGuess = function(guess) {
    this.wrongGuesses.push(guess);
    this.renderStats();
  }; // close recordWrongGuess method

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
    $("#loss-words").empty();
    this.lossWords.forEach(renderLossWordsToScreen);
    renderHangmanImage(this.wrongGuesses.length);
  }; // close renderStats method 

  this.summarizeGame = function () {
    $("#round-data", "#picture-card").hide();
    var sucessRate = (parseFloat(this.winCount) / parseFloat(this.winCount + this.lossCount));
    console.log("Sucess rate = " + sucessRate);
    alert(`You won ${this.winCount} and lost ${this.lossCount}, so your success rate was only ${parseFloat(sucessRate * 100).toFixed(0)+"%"}. But you wouldn't have survived north of the Wall anyway, traitor.`);
  };

  this.startRound = function () {
    this.resetRoundData();
    this.selectWord();
    this.makeSymbolArray(this.selectedWord);
    this.makeSymbolString(this.symbolArray);
  };

}; // closes Game object definition

// Some named functions to be called by (callbacks passed to) forEach / filter / map / reduce methods (use case: game stats)

function renderLossWordsToScreen (element) {
  $("#loss-words").append(element + "<br>");
}

function renderWinWordsToScreen (element) {
  if ( element.tries === 1)
  {
    $("#win-words").append( ` ${element.wordWon} (Guessed it in ${element.tries} try) <br> `);
  }
  else
  {
    $("#win-words").append( ` ${element.wordWon} (Guessed it in ${element.tries} tries) <br> `);
  }
}

function renderHangmanImage(number) {
  $("#stage-image").attr( "src", `assets/hangman-images/${number}.jpg` );
}

// ----------------------------------------------------------------------------------------------
// MAIN PROCESS 
// ----------------------------------------------------------------------------------------------

// Instantiate the Game object
var game = new Game ();

// Start the first round:
game.startRound();

// Event listener game loop:
document.onkeyup = function(event) {
    // store user's input in variable 'letter', make it lower case for consistentcy, and log it:
    var letter = String.fromCharCode(event.keyCode).toUpperCase();
    console.log(letter);

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
            console.log("wordWon: " + wordWon);
            var tries = game.wrongGuesses.length;
            console.log("tries: " + tries);
            game.winWords.push( {"wordWon": wordWon ,"tries": tries  } )
            game.winWords.forEach(function(element) {console.log("Word: "+ element.wordWon + ", Tries: "+ element.tries )})

            // Prompt user to play again, or not, and call appropriate function
            var replay = confirm("You win! Play again?");
              if (replay) 
              { game.startRound(); }
              else { game.summarizeGame(); }
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

              // Prompt user to play again, or not, and call appropriate function
              var replay = confirm("Your watch has ended! \n Play again?");
                if (replay) { game.startRound(); }
                else { game.summarizeGame(); }
            }
      }
    } // close IF INCORRECT block

}; // Closes EVENT LISTENER
