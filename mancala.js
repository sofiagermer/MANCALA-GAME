/* --------------------------------------------------- */
/* GLOBAL VARIABLES*/

var myIndex = 0;
const RulesID = ["Rule1", "Rule2", "Rule3", "Rule4", "Rule5"];
const PlayID = [ "BoardOptions", "SinglePlayerOptions", "StartPlaying"];
const seedColors = ["url(padrao1.jpg)", "url(padrao2.jpg)", "url(padrao3.jpg)", "url(padrao4.jpg)", "url(padrao5.jpg)", "url(padrao6.jpg)",
                    "url(padrao7.jpg)", "url(padrao8.jpg)", "url(padrao9.jpg)", "url(padrao10.jpg)", "url(padrao11.jpg)", "url(padrao12.jpg)" ];
var currentPlayOption = 0;
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
var roundCounter; //TODO usar isto
var isPlayerTurn;
//var serverUrl = "http://127.0.0.1:9028";
var serverUrl = "http://twserver.alunos.dcc.fc.up.pt:8008";

/* --------------------------------------------------- */
/*Auxiliar Functions to show/hide HTML elements*/
function showBlock(elementID){
    document.getElementById(elementID).style.display = "block"; 
}

function showFlex(elementID){
    document.getElementById(elementID).style.display = "flex"; 
}

function hide(elementID){
  document.getElementById(elementID).style.display = "none"; 
}

/* --------------------------------------------------- */
/*SLIDESHOW*/

//carousel();

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
/*LOGIN*/
//logo animation
function rotateLogo() {
    document.getElementById('waitinglogo').style.transform +='rotate('+0.5+'deg)';
    setTimeout(rotateLogo, 50); // Change image every 2 seconds
  }

  rotateLogo();
/* --------------------------------------------------- */
/*NAVBAR*/
function openPage(pageName, showID, hideID1, hideID2,hideID3) {
    //console.log("mudar de pag");
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

    document.getElementById(showID).style.color = "#000000";
    document.getElementById(hideID1).style.color = "#8f8f8f";
    document.getElementById(hideID2).style.color = "#8f8f8f";
    document.getElementById(hideID3).style.color = "#8f8f8f";
  
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("navbarPlayButton").click(); 

/* --------------------------------------------------- */
/*ABOUT US*/
  function aboutUsButton(activeID, hideID){
      showFlex(activeID);
      hide(hideID)
  }
/* --------------------------------------------------- */
/*PLAY CONFIGURATIONS*/

/* choose number of holes*/
function getNumberHoles(numberHoles, idActive, idNonActive1, idNonActive2 , idNonActive3, idNonActive4) {
    numHoles = numberHoles;
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive4).style.background = "rgb(103,155,155,0.5)";

    document.getElementById("zonaTabuleiro").style.width = 30;
}

/* choose number of seeds*/
function getNumberSeeds(numberSeeds, idActive, idNonActive1, idNonActive2 , idNonActive3){
    numSeeds = numberSeeds;
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
}

/* choose player mode*/
function onePlayer(){
    singlePlayer = true;
    document.getElementById('sP').style.background = "rgb(103,155,155)";
    document.getElementById('mP').style.background = "rgb(103,155,155,0.5)";
    //document.getElementById('singlePlayerOptions').style.display = "block";
}

function multiPlayer(){
    singlePlayer = false;
    document.getElementById('mP').style.background = "rgb(103,155,155)";
    document.getElementById('sP').style.background = "rgb(103,155,155,0.5)";
    //document.getElementById('singlePlayerOptions').style.display = "none";
}

/*choose who starts game*/
function whoStarts(isComputerStarting,idActive, idOther){
    isPlayerTurn = !isComputerStarting;
    console.log(isComputerStarting);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
}

function chooseLevel(level, idActive, idNonActive1, idNonActive2, idNonActive3, idNonActive4) {
    aiLevel = level;
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idNonActive1).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive2).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive3).style.background = "rgb(103,155,155,0.5)";
    document.getElementById(idNonActive4).style.background = "rgb(103,155,155,0.5)";
}

function nextPlayOption() {
    hide(PlayID[currentPlayOption]);

    if (singlePlayer) {
        if (currentPlayOption == 0) currentPlayOption = 1;
        else if (currentPlayOption == 1) currentPlayOption = 2;
        else if (currentPlayOption == 2) currentPlayOption = 0;
    } else {
        if (currentPlayOption == 0) currentPlayOption = 2;
        else if (currentPlayOption == 2) currentPlayOption = 0;
    }

    showBlock(PlayID[currentPlayOption]);
}

function previousPlayOption() {
    hide(PlayID[currentPlayOption]);

    if (singlePlayer) {
        if (currentPlayOption == 0) currentPlayOption = 2;
        else if (currentPlayOption == 1) currentPlayOption = 0;
        else if (currentPlayOption == 2) currentPlayOption = 1;

    } else {
        if (currentPlayOption == 0) currentPlayOption = 2;
        else if (currentPlayOption == 2) currentPlayOption = 0;
    }

    showBlock(PlayID[currentPlayOption]);
}


/* --------------------------------------------------- */
/*RULES*/
  
function nextRule() {
    let beforeRule = RulesID[currentRule];
    currentRule += 1;
    if (currentRule == 5) currentRule = 0;
    let afterRule = RulesID[currentRule];

    hide(beforeRule);
    showFlex(afterRule);  
}

function previousRule() {
    let beforeRule = RulesID[currentRule];
    currentRule -= 1;
    if (currentRule == -1) currentRule = 4;
    let afterRule = RulesID[currentRule];

    hide(beforeRule);
    showFlex(afterRule);
}

/*------------*/
/* DESENHAR TABULEIRO*/
function createHoleCima(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id", id);
    document.getElementById("sub-sub-tabuleiro-2").appendChild(ui[id]);
    ui[id].addEventListener("click", () => selectCavity(id, board, score, true));

    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    //console.log("id= " + id + " board[id]= "+ board[id]);
    
    for (let j = 0; j < board[id]; j++) {
        var s1 = document.createElement("div");
        s1.setAttribute("class", "seed");
        var name = "seed";
        var number = j.toString();
        var seedID =  name.concat(number);
        seedID = seedID.concat(id);
        s1.setAttribute("id", seedID);
        seeds.appendChild(s1);
        var randomRotation = Math.floor(Math.random() * 360);
        document.getElementById(seedID).style.transform= 'rotate('+randomRotation+'deg)';
        document.getElementById(seedID).style.left=  Math.floor(Math.random() * 20)+'px'; 
        document.getElementById(seedID).style.top = Math.floor(Math.random() * 20)+'px';
        //var random_color = seedColors[Math.floor(Math.random() * seedColors.length)];
        //document.getElementById(seedID).style.backgroundImage = random_color;
    }
}

function createHoleBaixo(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id", id);
    document.getElementById("sub-sub-tabuleiro-1").appendChild(ui[id]);
    ui[id].addEventListener("click", () => selectCavity(id, board, score, true));


    var seeds = document.createElement("div");
    seeds.setAttribute("class", "seedspace");
    ui[id].appendChild(seeds);

    for (let j = 0; j < board[id]; j++) {
        //console.log("id : " + id + " seeds :" +  board[id]);
        var s2 = document.createElement("div");
        s2.setAttribute("class", "seed");
        var name = "seed";
        var number = j.toString();
        var seedID =  name.concat(number);
        seedID = seedID.concat(id);
        s2.setAttribute("id", seedID);
        seeds.appendChild(s2);
        var randomRotation = Math.floor(Math.random() * 360);
        document.getElementById(seedID).style.transform= 'rotate('+randomRotation+'deg)';
        document.getElementById(seedID).style.left=  Math.floor(Math.random() * 20)+'px'; 
        document.getElementById(seedID).style.top = Math.floor(Math.random() * 20)+'px';
        //var random_color = seedColors[Math.floor(Math.random() * seedColors.length)];
        //document.getElementById(seedID).style.backgroundImage = random_color;
        //document.getElementById(seedID).css('transform','rotate(' + randomRotation + 'deg) ');
    }
}

function drawBoard() {
    hide('waitingForPlayer');
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);
    
    var numberSeedRightDiv = document.createElement("div");
    numberSeedRightDiv.setAttribute("id", "numberSeedRightDiv");
    document.getElementById("tabuleiro").appendChild(numberSeedRightDiv);

    var numberSeedRight = document.createElement("div");
    numberSeedRight.setAttribute("id", "numberSeedRight");
    numberSeedRight.setAttribute("class", "numberSeeds");
    document.getElementById("numberSeedRightDiv").appendChild(numberSeedRight);

    var middle = document.createElement("div");
    middle.setAttribute("id", "middle");
    document.getElementById("tabuleiro").appendChild(middle);


    var lateralEsquerda = document.createElement("div");
    lateralEsquerda.setAttribute("class", "lateral");
    document.getElementById("middle").appendChild(lateralEsquerda);

    var seedsE = document.createElement("div");
    seedsE.setAttribute("class", "seedspace");
    lateralEsquerda.appendChild(seedsE);

    for (var i = 0; i < score[1]; i++) {
        var buracoEsquerda = document.createElement("div");
        buracoEsquerda.setAttribute("class", "seed");
        var name = "seedHoleLeft";
        var number = i.toString();
        var seedID =  name.concat(number);
        buracoEsquerda.setAttribute("id", seedID);
        console.log(buracoEsquerda.id);
        console.log("seedID :", seedID);
        seedsE.appendChild(buracoEsquerda);
        var randomRotation = Math.floor(Math.random() * 360);
        document.getElementById(seedID).style.transform= 'rotate('+randomRotation+'deg)';
        document.getElementById(seedID).style.left=  Math.floor(Math.random() * 20)+'px'; 
        document.getElementById(seedID).style.top = Math.floor(Math.random() * 20)+'px';
    }

    var c = document.createElement("div");
    c.setAttribute("id", "sub-tabuleiro");
    document.getElementById("middle").appendChild(c);

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
    document.getElementById("middle").appendChild(lateralDireita);

    var seedsD = document.createElement("div");
    seedsD.setAttribute("class", "seedspace");
    lateralDireita.appendChild(seedsD);

    for(var i = 0; i < score[0]; i++){
        var buracoDireita = document.createElement("div");
        buracoDireita.setAttribute("class", "seed");
        seedsD.appendChild(buracoDireita);
    }

    var numberSeedLeftDiv = document.createElement("div");
    numberSeedLeftDiv.setAttribute("id", "numberSeedLeftDiv");
    document.getElementById("tabuleiro").appendChild(numberSeedLeftDiv);

    var numberSeedLeft = document.createElement("div");
    numberSeedLeft.setAttribute("id", "numberSeedLeft");
    numberSeedLeft.setAttribute("class", "numberSeeds");
    document.getElementById("numberSeedLeftDiv").appendChild(numberSeedLeft);
}

/*------------*/
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomMove() { //Unused
    var items = [];
    var i = (isPlayerTurn? 0 : numHoles/2);
    for (var j = 0; j < numHoles/2; j++)
        if (board[i+j] != 0) 
            items.push(i+j);

    return items[Math.floor(Math.random()*items.length)];
}

function getBestMove(maxDepth, boardMock = [], scoreMock = [], depth = 0) {
    if (depth == maxDepth) return scoreMock[1] - scoreMock[0];

    var availablePlays = [];
    var i = (isPlayerTurn? 0 : numHoles/2);
    for (var j = 0; j < numHoles/2; j++)
        if (boardMock[i+j] != 0) 
            availablePlays.push(i+j);
    
    if (availablePlays.length == 0) return scoreMock[1] - scoreMock[0];
    
    var currentBestIndex = -1;
    var currentBestValue = isPlayerTurn ? numHoles*numSeeds : -numHoles*numSeeds;
    var boardMockCopy = [...boardMock];
    var scoreMockCopy = [...scoreMock];
    var isPlayerTurnCopy = isPlayerTurn;
    
    var currentValue;
    for (var i = 0; i < availablePlays.length; i++) {
        executePlay(availablePlays[i], boardMock, scoreMock);        
        currentValue = getBestMove(maxDepth, boardMock, scoreMock, depth + 1);

        if ((isPlayerTurnCopy && currentBestValue > currentValue) || (!isPlayerTurnCopy && currentBestValue < currentValue)) {
            currentBestValue = currentValue;
            currentBestIndex = availablePlays[i];
        }

        boardMock = [...boardMockCopy];
        scoreMock = [...scoreMockCopy];
        isPlayerTurn = isPlayerTurnCopy;
    }

    if (depth == 0) {
        console.log("Player 2 chose cavity " + currentBestIndex);
        return currentBestIndex;
    }
    return currentBestValue;
}

function gameSetup(hideID, showID) {
    board = [];
    ui = [];
    score = [0,0];
    roundCounter = 0;

    for (var i = 0; i < numHoles; i++) {
        board.push(numSeeds);
    }
    
    hide(hideID);
    
    if (singlePlayer) {
        drawBoard(); 
    } else {
        showFlex('waitingForPlayer');
        sendJoin();
    }
    showFlex(showID);
}
function verifyScoring(cavityIndex, b, s) {
    if ((isPlayerTurn && cavityIndex < (numHoles/2)) || (!isPlayerTurn && cavityIndex >= (numHoles/2))) {
        if (b[cavityIndex] == 1) {
            var oppositeCavity = numHoles - cavityIndex - 1;

            s[isPlayerTurn ? 0 : 1] += b[oppositeCavity] + 1;

            b[oppositeCavity] = 0;
            b[cavityIndex] = 0;
        }
    }
}
// invalid start position: 8
// invalid empty pit: 3
function isCavityValid(index, b, calledByPlayer) {
    console.log("isCavityValid called!");

    if (!calledByPlayer) return true; // Without this line, it was impossible to distinguish if user played outside his turn or if AI played in his turn

    if (!isPlayerTurn) {
        //alert("Not your turn to play");
        showFlex('MessagesDiv1');
        hide('MessagesDiv2');
        hide('MessagesDiv3');
        console.log("estou aqui \n");
        return false;
    }

    if (index > numHoles/2) {
        showFlex('MessagesDiv2');
        hide('MessagesDiv1');
        hide('MessagesDiv3');
        //alert("Invalid start position: " + index);
        return false;
    }

    if (b[index] == 0) {
        showFlex('MessagesDiv3');
        hide('MessagesDiv1');
        hide('MessagesDiv2');
        //alert("Invalid empty pit: " + index);
        return false;
    }

    return true;
} 

/**LÓGICA DO JOGO ESTÁ AQUI */
async function selectCavity(idCavity, b, s, calledByPlayer) {
    if (!singlePlayer) {
        sendNotify(idCavity);
        return;
    }

    if (isCavityValid(idCavity, b, calledByPlayer) && !isGameFinished(b,s)) {

        clearBoard();
        console.log("Player " + (isPlayerTurn ? 1 : 2) + " chose cavity " + idCavity);
        executePlay(idCavity, b, s);
        drawBoard();
        if (singlePlayer && !isPlayerTurn) {
            await sleep(500);
            selectCavity(getBestMove(aiLevel*2, [...board], [...score]), b, s, false);
            return;
        }

        if (isGameFinished(board, score)) {
            finishGame(board, score);
        }
    }
}

function executePlay (cavityIndex, b, s) {

    var initialSeeds = b[cavityIndex];
    b[cavityIndex] = 0;
    var lastCavityWasStorage = false;

    for (var seeds = initialSeeds; seeds != 0; seeds--) {
        cavityIndex = (cavityIndex + 1) % numHoles;

        var isPlayerStorage = (cavityIndex == (isPlayerTurn? (numHoles/2) : 0));
        if (isPlayerStorage && !lastCavityWasStorage) {
            s[isPlayerTurn? 0 : 1]++;
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
        isPlayerTurn = !isPlayerTurn; // switch turn
}

function isGameFinished(b, s) {

    var minScoreToWin = numHoles * numSeeds / 2;
    if (Math.max(s[0], s[1]) > minScoreToWin)
        return true;

    var i = (isPlayerTurn ? 0 : numHoles/2);
    for (var j = 0; j < numHoles/2; j++)
        if (b[i+j] != 0)
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

    else if (s[1] > (numHoles/2) * numSeeds) {
        // Anounce player 2 victory
        console.log('Player 2 wins!');
        return;
    }

    else console.log('Draw!')

    return updateClassifications(s);
}

/*
<table id="highscores">
    <tr><td>Name</td><td>Score</td></tr>
</table>

var highScoreTable = document.getElementById("highscores");
*/


/*
var highScores = [
    {name: "Maximillian", rating: 1000, playerScore: 48, opponentScore: 0},
    {name: "The second guy", rating: 700, playerScore: 36, opponentScore: 12},
    {name: "The newbie", rating: 50, playerScore: 30, opponentScore: 18}
];
*/

function setHighscores(highScores) {
    localStorage.setItem("highscores", JSON.stringify(highScores));
}

function showRanking(ranking) {
    for (var i = 0; i < ranking.length; i++) {

    }
}

function updateClassifications(s) {
    // TODO
    var retrievedScores = JSON.parse(localStorage.getItem("highscores"));
    for (var i = 0; i < retrievedScores.length; i++) {
        // highScoreTable.innerHTML += "<tr><td>" + retrievedScores[i].name + "</td><td>" + retrievedScores[i].score + "</td></tr>";
    }
    
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
  
async function startGame(hideID, showID) {
    gameSetup(hideID, showID);

    if (singlePlayer && !isPlayerTurn) {
        await sleep(1000);
        selectCavity(getBestMove(aiLevel*2, [...board], [...score]), board, score, false);
    }
}
// ########################################################################################
// #                                                                                      #
// #                                    SEGUNDA ENTREGA                                   #
// #                                 CLIENT SIDE FUNCTIONS                                #
// #                                                                                      #
// ########################################################################################

// ########################################################################################
// #                                      VARIABLES                                       #

const rankingBtn = document.getElementById('ranking-btn');

var token = 0; // Error token

// User 1
var nickInput;
var passwordInput;
var opponentNick;
var turn;
var myBoard;
var myScore;
var myTotalScore;
var opponentBoard;
var opponentScore;
var opponentTotalScore;

var move;

// ########################################################################################
// #                               ASK USER REGIST INFO                                   #

function register(hideID, showID) {
    nickInput = document.getElementById('nameInput').value;
    passwordInput = document.getElementById('passwordInput').value;
    sendRegister(hideID, showID);
}


// ########################################################################################


const sendHttpRequest = (request, url, data) => {
    //return fetch('http://twserver.alunos.dcc.fc.up.pt:8008/'+ url, {
    return fetch(serverUrl+'/'+ url, {
        method: request,
        body: JSON.stringify(data),
        headers: data ? {'Content-Type': 'application/json'} :  {}
    }).then(response => {
        if (response.status >= 400){
            return response.json().then(errorResponseData => {
                const error = new Error('Something went wrong.');
                error.data = errorResponseData.error;
                throw error;
            })
        }
        else return response.json();
    });
}


const sendJoin = () => {
    sendHttpRequest('POST', 'join', {nick: nickInput, password: passwordInput, size: numHoles/2, initial: numSeeds, group:2725})
    .then( responseData => {
        console.log("Success sending join request.");
        token = responseData.game;
        sendUpdate();
    })
    .catch( error => alert("Error when joining game queue : "+error.data));
};



const sendLeave = () => {
    sendHttpRequest('POST', 'leave', {nick: nickInput, password: passwordInput, game: token})
    .then(() => {
        console.log("Success sending leave request");
        token = 0;
    })
    .catch( error => alert("Error when leaving game : "+error.data));
};



const sendNotify = (currentBestMoveIndex) => {
    sendHttpRequest('POST', 'notify', {nick: nickInput, password: passwordInput, game:token, move: currentBestMoveIndex})
    .then(() => console.log("Sucess sending notify request"))
    .catch( error => alert("Error when playing cavity : "+error.data));
};



const sendRanking = () => {
    sendHttpRequest('POST', 'ranking', {})
    .then( responseData => {
        console.log("Success sending ranking request");
        showRanking(responseData.ranking);
    })
    .catch( error => alert("Error when retrieving rankings : "+error.data));
};



const sendRegister = (hideID, showID) => {
    sendHttpRequest('POST', 'register', {nick: nickInput, password: passwordInput})
    .then( () => {
        console.log("Success sending register request.");
        hide(hideID);
        showFlex(showID);
    })
    //.catch( error => alert("Error when registering : "+error.data));
    .catch(  error => document.getElementById("loginError").innerHTML = error.data );
};

const endGame = (responseData) => {
    var gameEndedMessage;

    if (responseData.winner != null)
        gameEndedMessage = (responseData.winner == nickInput) ? "You won!" : "You lost!";
    else if ("board" in responseData)
        gameEndedMessage = "Draw!";

    if (gameEndedMessage) alert(gameEndedMessage);
    clearBoard();
    hide('playZone');
    showFlex('beforePlay');
};

// Server-Sent Events com GET e dados urlencoded
const sendUpdate = () => {
    let sse = new EventSource(serverUrl+'/update?nick='+nickInput+'&game='+token);
    sse.onmessage = response => {
        console.log("Received update from server");
        var responseData = JSON.parse(response.data);

        if ("winner" in responseData) {
            sse.close(); //TODO saber se isto funciona
            endGame(responseData);
            return;
        }
        
        isPlayerTurn = (responseData.board.turn == nickInput);
        myBoard = responseData.board.sides[nickInput].pits;
        for (let i = 0; i < numHoles/2; i++) {
            board[i] = myBoard[i];
        }
        score[0] = responseData.board.sides[nickInput].store;

        if (!opponentNick)
            for (var playerName in responseData.stores)
                if (playerName != nickInput) 
                    opponentNick = playerName;

        opponentBoard = responseData.board.sides[opponentNick].pits;
        for (let i = 0; i < numHoles/2; i++) {
            board[i+numHoles/2] = opponentBoard[i];
        }
        score[1] = responseData.board.sides[opponentNick].store;

        clearBoard();
        drawBoard();
    };
    sse.onerror = error => {
        alert("Comunication with server terminated.");
        sse.close();
    }; 
};

//rankingBtn.addEventListener('click', sendRanking);