
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

function verifyScoring(cavityIndex) {
    if ((isPlayer1Turn && cavityIndex < playerCavityNumber) || (!isPlayer1Turn && cavityIndex >= playerCavityNumber)) {
        if (board[cavityIndex] == 1) {
            var oppositeCavity = totalCavities-cavityIndex-1

            score[isPlayer1Turn ? 0 : 1] += board[oppositeCavity] + 1;

            board[oppositeCavity] = 0;
            board[cavityIndex] = 0;
        }
    }
}

function isCavityValid(index) {
    if (isPlayer1Turn) {
        if (index >= 0 && index < playerCavityNumber) {
            return board[index] != 0;
        }
    }
    else {
        if (index >= playerCavityNumber && index < totalCavities) {
            return board[index] != 0;
        }
    }

    return false;
}

function selectCavity() {
    
    console.log('Choose a number between ' + (isPlayer1Turn ? 0 : playerCavityNumber - 1) + 
                ' and ' + (isPlayer1Turn ? playerCavityNumber : totalCavities - 1));


    var chosenCavity = Math.floor(Math.random() * totalCavities);
    // read input to chosen cavity
    
    while (true) {
        if (isCavityValid(chosenCavity)) {
            console.log("Chosen cavity = " + chosenCavity);
            return chosenCavity;
        }
        console.log("Wrong input. Choose another cavity.");
        chosenCavity = Math.floor(Math.random() * totalCavities);
        // read input to chosen cavity
    }
}

// Leagacy code
/*
function executePlay(cavityIndex) { //TODO
    var seeds = board[cavityIndex];
    var loopCounter = Math.floor(seeds/totalCavities);
    var storageCounter = 0;
    //var didBoardSideSwitch = false;
    var lastSeedOnStorage = false;

    var debugCounter = 0;

    console.log("Seeds: " + seeds);
    console.log("LoopCounter: " + loopCounter);

    for (var i = cavityIndex; i < cavityIndex + seeds + loopCounter - storageCounter; i++) {
        debugCounter++;

        var lastSeedOnStorage = false;
        var currentCavity = i % totalCavities;
        var isInitialCavity = (currentCavity == cavityIndex);
        var isOpositePlayerFirstCavity = (currentCavity == (isPlayer1Turn ? playerCavityNumber : 0));
        //var isCurrentPlayerLastCavity = (currentCavity == (isPlayer1Turn ? playerCavityNumber - 1 : totalCavities));

        console.log("\nSeeding iteration # " + debugCounter);
        console.log("Seeding at cavity # " + currentCavity);

        if (isOpositePlayerFirstCavity && didBoardSideSwitch) {
            didBoardSideSwitch = false;
            storageCounter++;
            lastSeedOnStorage = true;

            score[(isPlayer1Turn ? 0 : 1)]++;
            //continue;
        } 

        else if (isCurrentPlayerLastCavity) {
            didBoardSideSwitch = true;
        }

        if (isOpositePlayerFirstCavity && !lastSeedOnStorage) {
            lastSeedOnStorage = true;
            score[(isPlayer1Turn ? 0 : 1)]++;
            i--;
        }

        board[currentCavity]++;

        console.log("Max i value: " + (cavityIndex + seeds + loopCounter - storageCounter));
    }
    /*
    for (var i = 1; i < seeds + loopCounter + 1; i++) {
        if (i == totalCavities) loopCounter++;

        board[(i + cavityIndex) % totalCavities]++;
    }
    


    board[cavityIndex] = 0;

    verifyScoring((i + cavityIndex - 1) % totalCavities);
    switchTurn(lastSeedOnStorage);
}
*/

function executePlay (cavityIndex) {
    var initialSeeds = board[cavityIndex];
    board[cavityIndex] = 0;
    var lastCavityWasStorage = false;

    for (var seeds = initialSeeds; seeds != 0; seeds--) {
        cavityIndex = (cavityIndex + 1) % totalCavities;

        var isPlayerStorage = (cavityIndex == (isPlayer1Turn? playerCavityNumber : 0));
        if (isPlayerStorage && !lastCavityWasStorage) {
            score[isPlayer1Turn? 0 : 1]++;
            cavityIndex--;

            lastCavityWasStorage = true;
            continue;
        }

        board[cavityIndex]++;
        lastCavityWasStorage = false;

    }
    
    if (!lastCavityWasStorage) verifyScoring(cavityIndex);
    switchTurn(lastCavityWasStorage);
}

function switchTurn(lastSeedOnStorage) {
    if (!lastSeedOnStorage) isPlayer1Turn = !isPlayer1Turn;
    roundCounter++;
}

function isGameFinished() {
    var canPlayer1Play = false;
    var canPlayer2Play = false;

    for (var i = 0; i < playerCavityNumber; i++) {
        if (board[i] != 0) {
            canPlayer1Play = true;
            break;
        }
    }

    for (var i = playerCavityNumber; i < totalCavities;i++) {
        if (board[i] != 0) {
            canPlayer2Play = true;
            break;
        }
    }

    if (isPlayer1Turn && canPlayer1Play || !isPlayer1Turn && canPlayer2Play)
        return false;

    return true;
}

function finishGame () {
    for (var i = 0; i < totalCavities; i++) {
        var seeds = board[i];
        i < playerCavityNumber ? score[0] += seeds : score[1] += seeds;
    }

    if (score[0] > playerCavityNumber * initialSeedsPerCavity) {
        // Anounce player 1 victory
        console.log('Player 1 wins!');
        return;
    }

    if (score[1] > playerCavityNumber * initialSeedsPerCavity) {
        // Anounce player 2 victory
        console.log('Player 2 wins!');
        return;
    }

    else console.log('Draw!')
}

function showBoard() {
    console.log('Eventually the board will be shown...');
}

function viewScore() {
    console.log("Scoring. Player 1: " + score[0] + ", Player 2: " + score[1] + '\n');
}

function viewBoard() {
    for (var i = 0; i < totalCavities; i++) {
        console.log(board[i] + " at index " + i);
    }

    console.log("\n");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    gameSetup();

    ///*
    while(true){
        viewBoard();
        viewScore();
        
        if (isGameFinished()) {
            finishGame();
            break;
        }

        await sleep(3000);
        executePlay(selectCavity());
    }
    //*/ 
    /*
    board[4] = 0;

    viewBoard();
    viewScore();

    executePlay(0);

    viewBoard();
    viewScore();
    */
}

main();
