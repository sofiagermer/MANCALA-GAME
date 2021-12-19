
var board = [];
var ui = [];
var score = [0,0];
var numHoles = 12;
var numSeeds = 4;
var tabuleiro;

var roundCounter = 0;

var isPlayer1Turn;
var isPlayer1Starting = true;

var pvp = false;
var aiLevel = 1;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getBestMove(boardMock, scoreMock, isMaximizing, depth = 0) {
    if (depth == 0) {
        boardMock = [...board];
        scoreMock = [...score];
    } 

    if (depth == 10) return scoreMock[1] - scoreMock[0];

    var availablePlays = [];
    var i = (isPlayer1Turn? 0 : numHoles/2);
    for (var j = 0; j < numHoles/2; j++)
        if (boardMock[i+j] != 0) 
            availablePlays.push(i+j);
    

    if (availablePlays.length == 0) return scoreMock[1] - scoreMock[0];
    
    var index = -1;
    var bestValue = isMaximizing ? -numHoles*numSeeds : numHoles*numSeeds;
    var value = bestValue;
    var boardMockCopy = [...boardMock];
    var scoreMockCopy = [...scoreMock];
    var playerTurnCopy = isPlayer1Turn;
    
    for (var i = 0; i < availablePlays.length; i++) {
        
        if (!isGameFinished(boardMock, scoreMock)) {
            executePlay(availablePlays[i], boardMock, scoreMock);        
            value = getBestMove(boardMock, scoreMock, !isPlayer1Turn, depth + 1);
        } 
        else return scoreMock[1] - scoreMock[0];

        if (isMaximizing) {
            if (value > bestValue) {
                value = bestValue;
                index = availablePlays[i];
            }
        }
        else if (value < bestValue) {
            value = bestValue;
            index = availablePlays[i];
        } 

        boardMock = [...boardMockCopy];
        scoreMock = [...scoreMockCopy];
        isPlayer1Turn = playerTurnCopy;
    }

    return index;   
}

function getNumberHoles() {
    numHoles = document.getElementById("numHoles").value;
}

function getNumberSeeds(){
    numSeeds = document.getElementById("numSeeds").value;
}

function createHoleCima(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id",id);
    document.getElementById("sub-sub-tabuleiro-2").appendChild(ui[id]);
    ui[id].addEventListener("click", ()=> selectCavity(id));

    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    console.log("id= " + id + " board[id]= "+ board[id]);
    
    for (let j = 0; j < board[id]; j++) {
        var s1 = document.createElement("div");
        s1.setAttribute("class", "seed");
        seeds.appendChild(s1);
    }
}

function createHoleBaixo(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id", id);
    document.getElementById("sub-sub-tabuleiro-1").appendChild(ui[id]);
    ui[id].addEventListener("click", ()=> selectCavity(id));


    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    for (let j = 0; j < board[id]; j++) {

        console.log("id : " + id + " seeds :" +  board[id]);
        var s2 = document.createElement("div");
        s2.setAttribute("class", "seed");
        seeds.appendChild(s2);
}
}

function drawBoard() {
    console.log("DENTRO DE DRAW BOARD");
    //document.getElementById("zonaTabuleiro").style.display = "block";
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);

    var lateralEsquerda = document.createElement("div");
    lateralEsquerda.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(lateralEsquerda);

    var seedsE = document.createElement("div");
    seedsE.setAttribute("class", "seedspace");
    lateralEsquerda.appendChild(seedsE);

    for(var i = 0; i < score[1]; i++){
        var buracoEsquerda = document.createElement("div");
        buracoEsquerda.setAttribute("class", "seed");
        seedsE.appendChild(buracoEsquerda);
    }

    var c = document.createElement("div");
    c.setAttribute("id", "sub-tabuleiro");
    document.getElementById("tabuleiro").appendChild(c);

    var d = document.createElement("div");
    d.setAttribute("class", "sub-sub-tabuleiro");
    d.setAttribute("id", "sub-sub-tabuleiro-2");
    document.getElementById("sub-tabuleiro").appendChild(d);

    for (let i = 1; i < numHoles/2 + 1; i++) {
        createHoleCima(numHoles-i);
    }

    var f = document.createElement("div");
    f.setAttribute("class", "sub-sub-tabuleiro");
    f.setAttribute("id", "sub-sub-tabuleiro-1")
    document.getElementById("sub-tabuleiro").appendChild(f);

    for (let i = 0; i < numHoles/2; i++) {
        createHoleBaixo(i);
    }

    var lateralDireita = document.createElement("div");
    lateralDireita.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(lateralDireita);

    var seedsD = document.createElement("div");
    seedsD.setAttribute("class", "seedspace");
    lateralDireita.appendChild(seedsD);

    for(var i = 0; i < score[0]; i++){
        var buracoDireita = document.createElement("div");
        buracoDireita.setAttribute("class", "seed");
        seedsD.appendChild(buracoDireita);
    }
}

function gameSetup() {
    // TODO - AI later on
    // PvP vs PvE setup
    // If PvE, AI level setup

    for (var i = 0; i < numHoles; i++) {
        board.push(numSeeds);
    }

    isPlayer1Turn = isPlayer1Starting;
}

function verifyScoring(cavityIndex, b, s) {
    if ((isPlayer1Turn && cavityIndex < (numHoles/2)) || (!isPlayer1Turn && cavityIndex >= (numHoles/2))) {
        if (b[cavityIndex] == 1) {
            var oppositeCavity = numHoles - cavityIndex - 1

            s[isPlayer1Turn ? 0 : 1] += b[oppositeCavity] + 1;

            if (isNaN(s[0]) || isNaN(s[1])) {
                console.log("NaN found, exiting...");
                process.exit(1);
            }

            b[oppositeCavity] = 0;
            b[cavityIndex] = 0;
        }
    }
}

function isCavityValid(index, b) {
    if (isPlayer1Turn) {
        if (index >= 0 && index < (numHoles/2))
            return b[index] != 0;
    }
    else if (index >= (numHoles/2) && index < numHoles)
            return b[index] != 0;

    return false;
}

function selectCavity(idCavity, b, s) {
    if (isCavityValid(idCavity, b)){
        executePlay(idCavity, b, s);
    }
}

function executePlay (cavityIndex, b, s) {

    var initialSeeds = b[cavityIndex];
    b[cavityIndex] = 0;
    var lastCavityWasStorage = false;

    for (var seeds = initialSeeds; seeds != 0; seeds--) {
        cavityIndex = (cavityIndex + 1) % numHoles;

        var isPlayerStorage = (cavityIndex == (isPlayer1Turn? (numHoles/2) : 0));
        if (isPlayerStorage && !lastCavityWasStorage) {
            s[isPlayer1Turn? 0 : 1]++;
            cavityIndex--;

            lastCavityWasStorage = true;
            continue;
        }

        b[cavityIndex]++;
        lastCavityWasStorage = false;

    }
    if (!lastCavityWasStorage) verifyScoring(cavityIndex, b, s);
    switchTurn(lastCavityWasStorage);
}

function switchTurn(lastSeedOnStorage) {
    if (!lastSeedOnStorage) 
        isPlayer1Turn = !isPlayer1Turn; // switch turn
}

function isGameFinished(b, s) {

    var minScoreToWin = numHoles * numSeeds / 2;
    if (s[0] > minScoreToWin || s[1] > minScoreToWin)
        return true;

    var canPlayer1Play = false;
    var canPlayer2Play = false;

    for (var i = 0; i < (numHoles/2); i++)
        if (b[i] != 0) {
            canPlayer1Play = true;
            break;
        }

    for (var i = (numHoles/2); i < numHoles;i++)
        if (b[i] != 0) {
            canPlayer2Play = true;
            break;
        }

    if (isPlayer1Turn && canPlayer1Play || !isPlayer1Turn && canPlayer2Play)
        return false;

    return true;
}

function finishGame (b, s) {
    for (var i = 0; i < numHoles; i++) {
        var seeds = b[i];
        i < (numHoles/2) ? s[0] += seeds : s[1] += seeds;
    }

    if (s[0] > (numHoles/2) * numSeeds) {
        // Anounce player 1 victory
        console.log('Player 1 wins!');
        return;
    }

    if (s[1] > (numHoles/2) * numSeeds) {
        // Anounce player 2 victory
        console.log('Player 2 wins!');
        return;
    }

    else console.log('Draw!')
}

function viewScore(s) {
    console.log("Scoring. Player 1: " + s[0] + ", Player 2: " + s[1] + '\n');
}

function viewBoard(b) {
    for (var i = 0; i < numHoles; i++) {
        console.log("board[" + i + "] = " + b[i]);
    }
}


function openPage(pageName, elmnt, color) {
    // Hide all elements with class="tabcontent" by default */
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Remove the background color of all tablinks/buttons
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
  
    // Show the specific tab content
    document.getElementById(pageName).style.display = "block";
  
    // Add the specific color to the button used to open the tab content
    elmnt.style.backgroundColor = color;
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click(); 

function clearBoard(){
    for (i = 0; i < tablinks.length; i++) {
        for (i = 0; i < tablinks.length; i++) {
            tabuleiro.style.backgroundColor = "";
            tabuleiro.style.backgroundColor = "";
        } 
    } 
}

function showBoard(){
    document.getElementById("zonaTabuleiro").style.display = "block"; 
}
  

async function main(){
    gameSetup();
    drawBoard();

    while(true) {
        /*showBoard();
        clearBoard();
        if (isGameFinished(board, score)) {
            finishGame(board, score);
            break;
        }

        console.log("Round number " + roundCounter + ". Player " + (isPlayer1Turn?1:2)+ " to move.")
        a = getBestMove([], [], !isPlayer1Turn);
        console.log("Best move is " + a);
        selectCavity(a, board, score);
        
        roundCounter++;
        */
    }
}
