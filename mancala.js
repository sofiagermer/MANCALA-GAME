/* --------------------------------------------------- */
/* GLOBAL VARIABLES*/

var myIndex = 0;
const RulesID = ["Rule1", "Rule2", "Rule3","Rule4","Rule5"];
var currentRule = 0;

/*GAME LOCIC*/

/*variáveis escolhidas pelo utilizador*/
var numHoles = 12;
var numSeeds = 4;
var singlePlayer = false;
var aiLevel = 1;

/*variáveis auxiliares*/
var board;
var ui;
var score;
var tabuleiro;
var roundCounter;
var isPlayer1Turn;
var pvp;


/* --------------------------------------------------- */
carousel();

/* --------------------------------------------------- */
/*SLIDESHOW*/
function carousel() {
  var i;
  var x = document.getElementsByClassName("mySlides");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  myIndex++;
  if (myIndex > x.length) {myIndex = 1}    
  x[myIndex-1].style.display = "block";  
  setTimeout(carousel, 2000); // Change image every 2 seconds
}

/* --------------------------------------------------- */
/*NAVBAR*/
function openPage(pageName) {
    console.log("mudar de pag");
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
  
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click(); 

/* --------------------------------------------------- */
/*PLAY CONFIGURATIONS*/

/* choose number of holes*/
function getNumberHoles(numberHoles, idActive, idNonActive1, idNonActive2 , idNonActive3, idNonActive4) {
    numHoles = numberHoles;
    console.log(numberHoles);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive4).style.background = "rgb(103,155,155,0.5)";
}

/* choose number of seeds*/
function getNumberSeeds(numberSeeds, idActive, idNonActive1, idNonActive2 , idNonActive3){
    numSeeds = numberSeeds;
    console.log(numberSeeds);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
}

/* choose player mode*/
function onePlayer(idActive, idOther,idOptions){
    singlePlayer = true;
    console.log(singlePlayer);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idOptions).style.display = "block";
}

function multiPlayer(idActive, idOther, idOptions){
    singlePlayer = false;
    console.log(singlePlayer);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idOptions).style.display = "none";
}

/*choose who starts game*/
function whoStarts(isComputerStarting,idActive, idOther){
    if(isComputerStarting){
        console.log("computador começa");
        console.log("player 1 não começa");
        isPlayer1Turn = false;
    }
    else{
        console.log("pessoa começa");
        console.log("player 1 começa");
        isPlayer1Turn = true;
    }
    console.log(isComputerStarting);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
}

function chooseLevel(level, idActive, idNonActive1, idNonActive2 , idNonActive3){
    aiLevel = level;
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
}


/* --------------------------------------------------- */
/*RULES*/
  
function nextRule() {
    let beforeRule = RulesID[currentRule];
    currentRule += 1;
    if(currentRule == 5) currentRule =0;
    let afterRule = RulesID[currentRule];
    document.getElementById(beforeRule).style.display = "none";
    document.getElementById(afterRule).style.display = "block";
  
}

  function previousRule() {
    let beforeRule = RulesID[currentRule];
    currentRule -= 1;
    if(currentRule ==-1) currentRule =4;
    let afterRule = RulesID[currentRule];
    document.getElementById(beforeRule).style.display = "none";

    document.getElementById(beforeRule).style.display = "none";
    document.getElementById(afterRule).style.display = "block";
  
  }

/* --------------------------------------------------- */
/*GAME LOGIC*/

/*CANCEL GAME*/

function cancelGame() {
    console.log("carreguei aqui");
    console.log("apaguei board");
    //document.getElementById(idGame).style.display = "none";
    //document.getElementById('tabuleiro').remove();
    //document.getElementById(idOptions).style.display = "flex";
    clearBoard();
    document.getElementById('playZone').style.display = "none";
    document.getElementById('beforePlay').style.display = "flex";
}

/*------------*/
/* DESENHAR TABULEIRO*/
function createHoleCima(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id",id);
    document.getElementById("sub-sub-tabuleiro-2").appendChild(ui[id]);
    ui[id].addEventListener("click", ()=> selectCavity(id, board, score));

    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    //console.log("id= " + id + " board[id]= "+ board[id]);
    
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
    ui[id].addEventListener("click", ()=> selectCavity(id, board, score));


    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    for (let j = 0; j < board[id]; j++) {

        //console.log("id : " + id + " seeds :" +  board[id]);
        var s2 = document.createElement("div");
        s2.setAttribute("class", "seed");
        seeds.appendChild(s2);
}
}

function drawBoard() {
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);
    /*if(document.getElementById("zonaTabuleiro")){
        console.log("yey já havia zona do tabuleiro");
        document.getElementById("zonaTabuleiro").appendChild(tabuleiro);
    }
    else{
        document.createElement("zonaTabuleiroo").appendChild(tabuleiro);
    }*/

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

/*------------*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomMove() {
    var items = [];
    var i = (isPlayer1Turn? 0 : numHoles/2);
    for (var j = 0; j < numHoles/2; j++)
        if (board[i+j] != 0) 
            items.push(i+j);

    return items[Math.floor(Math.random()*items.length)];
}

function getBestMove(boardMock, scoreMock, isMaximizing, depth = 0, maxDepth = 10) {
    if (depth == 0) {
        boardMock = [...board];
        scoreMock = [...score];
    } 

    if (depth == maxDepth) return scoreMock[1] - scoreMock[0];

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
            value = getBestMove(boardMock, scoreMock, !isPlayer1Turn, depth + 1, 10);
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

function gameSetup() {
    // TODO - AI later on
    // PvP vs PvE setup
    // If PvE, AI level setup
    board = [];
    ui = [];
    score = [0,0];
    roundCounter = 0;
    pvp = false;

    for (var i = 0; i < numHoles; i++) {
        board.push(numSeeds);
    }
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

/**LÓGICA DO JOGO ESTÁ AQUI */
async function selectCavity(idCavity, b, s) {
    if (isCavityValid(idCavity, b)){
        clearBoard();
        executePlay(idCavity, b, s);
        drawBoard();
        if(singlePlayer && !isPlayer1Turn){
            console.log("cpu joga");
            await sleep(300);
            selectCavity(getBestMove([],[],!isPlayer1Turn),b,s);
        }
    }
    if (isGameFinished(board, score)) {
        finishGame(board, score);
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

function clearBoard(){
    document.getElementById("zonaTabuleiro").innerHTML = "";
}

function showBoard(){
    //document.getElementById("playZone").style.display = "block"; 
}

function hidePlaySettings(playSettingsID){
  document.getElementById(playSettingsID).style.display = "none"; 
}
  
function startGame(playSettingsID){
    document.getElementById('playZone').style.display = "flex";
    if(singlePlayer){
      hidePlaySettings(playSettingsID);
      gameSetup();
      drawBoard(); 
    }
    else{
      hidePlaySettings(playSettingsID);
      gameSetup();
      drawBoard(); 
    }
}
