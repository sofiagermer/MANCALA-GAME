
var board = [];
var score = [0,0];

var playerCavityNumber = 6;
var initialSeedsPerCavity = 4;
var totalCavities;
var roundCounter = 0;

var isPlayer1Turn;
var isPlayer1Starting = true;

var pvp = false;
var aiLevel = 1;


function gameSetup() {
    // PvP vs PvE setup
    // If PvE, AI level setup

    totalCavities = playerCavityNumber*2;

    for (var i = 0; i < totalCavities; i++) {
        board.push(initialSeedsPerCavity);
    }


    isPlayer1Turn = isPlayer1Starting;
}

function verifyScoring() {
    
}

function selectCavity() {
    
    console.log('Choose a number between ' + (isPlayer1Turn ? 0 : playerCavityNumber - 1) + 
                ' and ' + (isPlayer1Turn ? playerCavityNumber : totalCavities - 1));

    return 5; //TODO
    var chosenCavity;
    // read input to chosen cavity
    
    while (true) {
        if ((isPlayer1 && chosenCavity >= 0 && chosenCavity < playerCavityNumber) ||
            (!isPlayer1 && chosenCavity >= playerCavityNumber && chosenCavity < totalCavities)) 
                return chosenCavity;
    }
}

function executePlay(cavityIndex) { //TODO
    var seeds = board[cavityIndex];
    
    var loopCounter = 0;
    var didBoardSideSwitch = false;

    for (var index = cavityIndex; index < cavityIndex + seeds + loopCounter; index++) {

        if (index % totalCavities == 0) loopCounter++;

        var currentCavity = index % totalCavities;
        var isOpositePlayerFirstCavity = (currentCavity == (isPlayer1Turn ? playerCavityNumber-1 : totalCavities-1));

        if (isOpositePlayerFirstCavity && didBoardSideSwitch) {
            didBoardSideSwitch = false;
            score[(isPlayer1Turn ? 0 : 1)]++;
            continue;
        }



    }
    /*
    for (var i = 1; i < seeds + loopCounter + 1; i++) {
        if (i == totalCavities) loopCounter++;

        board[(i + cavityIndex) % totalCavities]++;
    }
    */


    board[cavityIndex] = 0;

    verifyScoring((i + cavityIndex - 1) % totalCavities);
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

function viewBoard() {
    for (var i = 0; i < totalCavities; i++) {
        console.log(board[i] + " at index " + i);
    }

    console.log("\n\n\n");
}

function main() {
    gameSetup();

    /*
    while(true){
        showBoard();
        if (isGameFinished()) return 0;

        executePlay(selectCavity());

        isPlayer1Turn = !isPlayer1Turn;
        roundCounter++;
    }
    */

}

main();
