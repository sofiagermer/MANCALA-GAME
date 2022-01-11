/* --------------------------------------------------- */
/* GLOBAL VARIABLES*/

var myIndex = 0;
const RulesID = ["Rule1", "Rule2", "Rule3", "Rule4", "Rule5"];
const PlayID = [ "BoardOptions", "SinglePlayerOptions", "StartPlaying"];
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
var tabuleiro;
var roundCounter;
var isPlayer1Turn;
var pvp;

/* --------------------------------------------------- */
/*Auxiliar Functions to show/hide HTML elements*/
function showBLock(elementID){
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
/*NAVBAR*/
function openPage(pageName) {
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

    document.getElementById("zonaTabuleiro").style.width = 30;
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
function onePlayer(idActive, idOther){
    singlePlayer = true;
    console.log(singlePlayer);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
    //document.getElementById(idOptions).style.display = "block";
}

function multiPlayer(idActive, idOther){
    singlePlayer = false;
    console.log(singlePlayer);
    document.getElementById(idActive).style.background = "rgb(103,155,155)";
    document.getElementById(idOther).style.background = "rgb(103,155,155,0.5)";
    //document.getElementById(idOptions).style.display = "none";
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

    showBLock(PlayID[currentPlayOption]);
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

    showBLock(PlayID[currentPlayOption]);
}


/* --------------------------------------------------- */
/*RULES*/
  
function nextRule() {
    let beforeRule = RulesID[currentRule];
    currentRule += 1;
    if (currentRule == 5) currentRule = 0;
    let afterRule = RulesID[currentRule];

    hide(beforeRule);
    showBLock(afterRule);
  
}

  function previousRule() {
    let beforeRule = RulesID[currentRule];
    currentRule -= 1;
    if (currentRule == -1) currentRule = 4;
    let afterRule = RulesID[currentRule];

    hide(beforeRule);
    showBLock(afterRule);

  }

/* --------------------------------------------------- */
/*GAME LOGIC*/

/*CANCEL GAME*/

function cancelGame(hideID, showID) {
    clearBoard();
    hide(hideID);
    showFlex(showID);
}

/*------------*/
/* DESENHAR TABULEIRO*/
function createHoleCima(id){
    ui[id] = document.createElement("button");
    ui[id].setAttribute("class", "quadrado");
    ui[id].setAttribute("id", id);
    document.getElementById("sub-sub-tabuleiro-2").appendChild(ui[id]);
    ui[id].addEventListener("click", () => selectCavity(id, board, score));

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
    console.log("estou dentro do draw board");
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);

    var lateralEsquerda = document.createElement("div");
    lateralEsquerda.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(lateralEsquerda);

    var seedsE = document.createElement("div");
    seedsE.setAttribute("class", "seedspace");
    lateralEsquerda.appendChild(seedsE);

    for (var i = 0; i < score[1]; i++) {
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

function getBestMove(boardMock, scoreMock, isMaximizing, maxDepth = 10, depth = 0) {
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
            value = getBestMove(boardMock, scoreMock, !isPlayer1Turn, maxDepth, depth + 1);
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
    board = [];
    ui = [];
    score = [0,0];
    roundCounter = 0;
    //pvp = false;

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
            selectCavity(getBestMove([],[],!isPlayer1Turn, aiLevel*2),b,s);
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

function updateClassifications(s) {
    
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
  
function startGame(playSettingsID, waitingForPlayer, playZone){
    gameSetup();

    if(singlePlayer){
        showFlex(playZone);
        hide(playSettingsID);
        drawBoard(); 
    }
    else{
      hide(playSettingsID);
      showFlex(waitingForPlayer);
      sendJoin();
      showFlex(playZone);
      hide(waitingForPlayer);
      drawBoard(); 
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


const joinBtn = document.getElementById('join-btn');
const leaveBtn = document.getElementById('leave-btn');
const notifyBtn = document.getElementById('notify-btn');
const rankingBtn = document.getElementById('ranking-btn');
const registerBtn = document.getElementById('register-btn');
const updateBtn = document.getElementById('update-btn');

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

function register(nickname,pass, hideID, showID){
    nickInput = document.getElementById(nickname).value;
    passwordInput = document.getElementById(pass).value;
    sendRegister();
    hide(hideID);
    showFlex(showID);
}


// ########################################################################################


const sendHttpRequest = (request, url, data) => {
    return fetch('http://twserver.alunos.dcc.fc.up.pt:8008/'+ url, {
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
        console.log(nickInput);
        console.log(passwordInput);
        token = responseData.game;
        console.log("token = " + token);
        //gameSetup();
        sendUpdate();
    })
    .catch( error => console.log("Error at sendJoin: " + error.data));
};



const sendLeave = () => {
    sendHttpRequest('POST', 'leave', {nick: nickInput, password: passwordInput, game: token})
    .then(() => {
        console.log("Success sending leave request");
        token = 0;
    })
    .catch( error => console.log("Error at sendLeave: " + error.data));
};



const sendNotify = () => {
    sendHttpRequest('POST', 'notify', {nick: nickInput, password: passwordInput, game:token, move: 1})
    .then(() => console.log("Sucess sending notify request"))
    .catch( error => console.log("Error at sendNotify: " + error.data));
};



const sendRanking = () => {
    sendHttpRequest('POST', 'ranking')
    .then( responseData => {
        console.log("Success sending ranking request");
        showRanking(responseData.ranking);
    })
    .catch( error => console.log("Error at sendRanking: " + error.data));
};



const sendRegister = () => {
    console.log(nickInput);
    console.log(typeof(nickInput));
    console.log(passwordInput);
    console.log(typeof(passwordInput));
    sendHttpRequest('POST', 'register', {nick: nickInput, password: passwordInput})
    .then( () => console.log("Success sending register request."))
    .catch( error => console.log("Error at sendRegister: " + error.data));
};


var myTimeout;
// Server-Sent Events com GET e dados urlencoded
const sendUpdate = () => {
    let sse = new EventSource('http://twserver.alunos.dcc.fc.up.pt:8008/update?nick='+nickInput+'&game='+token);
    sse.onmessage = response => {
        console.log("Received update from server");
        var responseData = JSON.parse(response.data);

        if ("winner" in responseData) {
            if ("board" in responseData && responseData.winner == null)
                console.log("Draw!");
            else 
                (responseData.winner == nickInput) ? console.log("You won!") : console.log("You lost!");
            clearTimeout(myTimeout);
            return;
        }
        
        turn = (responseData.board.turn == nickInput);
        myBoard = responseData.board.sides[nickInput].pits;
        for (let i = 0; i < numHoles/2; i++) {
            board[i] = myBoard[i];
        }
        score[0] = responseData.board.sides[nickInput].store;

        console.log("antes do !oponnent nick");
        if (!opponentNick)
            for (var playerName in responseData.stores)
                if (playerName != nickInput) 
                    opponentNick = playerName;

        console.log("antes do opponent board");
        opponentBoard = responseData.board.sides[opponentNick].pits;
        for (let i = 0; i < numHoles/2; i++) {
            board[i+numHoles/2] = myBoard[i];
        }
        score[1] = responseData.board.sides[opponentNick].store;

        console.log("antes do draw");
        drawBoard();

        myTimeout = setTimeout(sendUpdate, 5000);
    };
    sse.onerror = err => {
        console.log("EventSource failed:", err);
    };
};


//joinBtn.addEventListener('click', sendJoin);
leaveBtn.addEventListener('click', sendLeave);
notifyBtn.addEventListener('click', sendNotify.bind(move)); // N sei bem se isto passa um argumento pra funçao mas é suposto, qlqr cena posso mudar
rankingBtn.addEventListener('click', sendRanking);
//registerBtn.addEventListener('click', sendRegister);
updateBtn.addEventListener('click', sendUpdate);
