
var board = [];
var score = [0,0];

var playerCavityNumber = 6;
var initialSeedsPerCavity = 4;
var roundCounter = 0;

var isPlayer1Turn;
var isPlayer1Starting = true;

var pvp = false;
var aiLevel = 1;


function gameSetup() {
    // PvP vs PvE setup
    // If PvE, AI level setup

    for (var i = 0; i < playerCavityNumber * 2; i++) {
        board.push(initialSeedsPerCavity);
    }

    isPlayer1Turn = isPlayer1Starting;
}

function selectCavity(){
    console.log('Choosea number between 1 and ' + playerCavityNumber*2);
    return 5;
}

function executePlay(cavityIndex) {
    for (var i = board[cavityIndex]; i > 0; i--) {
        
    }
}

function isGameFinished() {
    return true;

    if (score[0] > playerCavityNumber * initialSeedsPerCavity) {
        console.log('Player 1 wins!');
        return true;
    }

    if (score[1] > playerCavityNumber * initialSeedsPerCavity){
        console.log('Player 2 wins!');
        return true;
    }

    return false;
}

function showBoard() {
    /*
    console.clear()
    console.log("\t\t\t\t\tRound " + roundCounter + "\n\n");
    console.log( "\x1b[41m","   P2");
    */

    console.log('Eventually the board will be shown...');
}

function main() {

    gameSetup();

    while(true){
        showBoard();
        if (isGameFinished()) return 0;

        executePlay(selectCavity());

        isPlayer1Turn = !isPlayer1Turn;
        roundCounter++;
    }
}

main();
