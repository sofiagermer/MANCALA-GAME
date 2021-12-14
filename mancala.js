
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

    for (let j = 0; j < board[numHoles/2+j]; j++) {
        var s2 = document.createElement("div");
        s2.setAttribute("class", "seed");
        seeds.appendChild(s2);
}
}

function drawBoard() {
    document.getElementById("zonaTabuleiro").style.display = "block";
    var tabuleiro = document.createElement("div");
    tabuleiro.setAttribute("id", "tabuleiro");
    document.getElementById("zonaTabuleiro").appendChild(tabuleiro);

    var b = document.createElement("div");
    b.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(b);

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

    var h = document.createElement("div");
    h.setAttribute("class", "lateral");
    document.getElementById("tabuleiro").appendChild(h);
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

function verifyScoring(cavityIndex) {
    if ((isPlayer1Turn && cavityIndex < (numHoles/2)) || (!isPlayer1Turn && cavityIndex >= (numHoles/2))) {
        if (board[cavityIndex] == 1) {
            var oppositeCavity = numHoles-cavityIndex-1

            score[isPlayer1Turn ? 0 : 1] += board[oppositeCavity] + 1;

            board[oppositeCavity] = 0;
            board[cavityIndex] = 0;
        }
    }
}

function isCavityValid(index) {
    if (isPlayer1Turn) {
        if (index >= 0 && index < (numHoles/2))
            return board[index] != 0;
    }
    else if (index >= (numHoles/2) && index < numHoles)
            return board[index] != 0;

    return false;
}

function selectCavity(idCavity) {
    while (true){
        if(isCavityValid(idCavity)){
            executePlay(idCavity);
            break;
        }
    }

   /* var el_up = document.getElementById("0");
    var el_down = document.getElementById("1");
    el_up.innerHTML = "Click on button to get ID";
      
    document.getElementById('1').onclick = GFG_click;
    document.getElementById('2').onclick = GFG_click;
    document.getElementById('3').onclick = GFG_click;
      
    function GFG_click(clicked) {
        el_down.innerHTML = "Button clicked, id = "
            + this.id;
    }     */
    /*
    console.log('Choose a number between ' + (isPlayer1Turn ? 0 : (numHoles/2) - 1) + 
                ' and ' + (isPlayer1Turn ? (numHoles/2) : numHoles - 1));


    var chosenCavity = Math.floor(Math.random() * numHoles); //TODO - change from random to user input

    // read input to chosen cavity
    
    while (true) {
        if (isCavityValid(chosenCavity)) {
            console.log("Chosen cavity = " + chosenCavity);
            return chosenCavity;
        }
        console.log("Wrong input. Choose another cavity.");
        chosenCavity = Math.floor(Math.random() * numHoles); //TODO - change from random to user input
        // read input to chosen cavity
    }*/
}

function executePlay (cavityIndex) {
    var initialSeeds = board[cavityIndex];
    board[cavityIndex] = 0;
    var lastCavityWasStorage = false;

    for (var seeds = initialSeeds; seeds != 0; seeds--) {
        cavityIndex = (cavityIndex + 1) % numHoles;

        var isPlayerStorage = (cavityIndex == (isPlayer1Turn? (numHoles/2) : 0));
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
    if (!lastSeedOnStorage) 
        isPlayer1Turn = !isPlayer1Turn; // switch turn
    roundCounter++;
}

function isGameFinished() {

    var minScoreToWin = numHoles * numSeeds / 2
    if (score[0] > minScoreToWin || score[1] > minScoreToWin)
        return true;

    var canPlayer1Play = false;
    var canPlayer2Play = false;

    for (var i = 0; i < (numHoles/2); i++) {
        if (board[i] != 0) {
            canPlayer1Play = true;
            break;
        }
    }

    for (var i = (numHoles/2); i < numHoles;i++) {
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
    for (var i = 0; i < numHoles; i++) {
        var seeds = board[i];
        i < (numHoles/2) ? score[0] += seeds : score[1] += seeds;
    }

    if (score[0] > (numHoles/2) * numSeeds) {
        // Anounce player 1 victory
        console.log('Player 1 wins!');
        return;
    }

    if (score[1] > (numHoles/2) * numSeeds) {
        // Anounce player 2 victory
        console.log('Player 2 wins!');
        return;
    }

    else console.log('Draw!')
}

function viewScore() {
    console.log("Scoring. Player 1: " + score[0] + ", Player 2: " + score[1] + '\n');
}

function viewBoard() {
    for (var i = 0; i < numHoles; i++) {
        console.log(board[i] + " at index " + i);
    }

    console.log("\n");
}

//TODO: clean-up
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        tabuleiro.style.backgroundColor = "";
      } 
}

function hideBoard(){
    document.getElementById("zonaTabuleiro").style.display = "none"; 
}
async function main() {
    gameSetup();

    while(true){
        hideBoard();
        drawBoard(); //TODO - clean up
       // viewScore(); //TODO - clean up
        /*
        if (isGameFinished()) {
            finishGame();
            break;
        }*/

        break;
    }
}