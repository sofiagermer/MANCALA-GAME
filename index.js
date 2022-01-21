const http = require('http');
const events = require('events');
const fs = require('fs'); // TODO Sending html file as response
const crypto = require('crypto'); // TODO Create cryptos
const { eventNames, send } = require('process');
const port = 9028; 

let error;
let responseBody;

let rank1 = {nick:"abcdefghidasdas", victories: 404, games: 576};
let rank2 = {nick:"123", victories: 318, games: 741};
let rank3 = {nick:"abcdefghi", victories: 172, games: 576};
let rank4 = {nick:"a", victories: 133, games: 254};
let rank5 = {nick:"group_21a", victories: 107, games: 167};
let rank6 = {nick:"ola1", victories: 98, games: 180};
let rank7 = {nick:"lol271998_", victories: 96, games: 134};
let rank8 = {nick:"amigo", victories: 90, games: 153};
let rank9 = {nick:"ola", victories: 89, games: 186};
let rank10 = {nick:"owo", victories: 88, games: 163};
const ranking = [rank1, rank2, rank3, rank4, rank5, rank6, rank7, rank8, rank9, rank10];

const loginCredentials = [];
const currentGames = [];
const waitingQueue = [];

const server = http.createServer(async function (request, response) {
    
    const { method, url, headers } = request;
    // Example: at login, method = "POST", url = "/login", headers = array { lowercase request headers: value}
    switch (method) {
        case "OPTIONS":
            response.writeHead(204, {
                'Access-Control-Allow-Headers': 'content-type',
                'Access-Control-Allow-Max-Age': '86400',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:5500',
                'Connection': 'Keep-Alive',
                'Keep-Alive': 'timeout=2, max=100',
                'Vary': 'Accept-Encoding, Origin'
            });
            response.end();
            return;
        case "POST":
            let body = [];

            // Parses request's body into javascript object
            for await (const chunk of request) body.push(chunk);
            body = JSON.parse(Buffer.concat(body).toString());

            response.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/javascript',
                'Keep-Alive': 'timeout=5',
                'Transfer-Encoding': 'chunked'
            });

            switch (url.substring(1)) {
                case "ranking": //TODO: actually criar um ranking
                    responseBody = {ranking};
                    break;
                case "register": //TODO: encriptar passwords na base de dados
                    if (processRegisterRequest(body)) responseBody = {};
                    else {
                        response.writeHead(400, {
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/javascript',
                            'Keep-Alive': 'timeout=5',
                            'Transfer-Encoding': 'chunked'
                        });
                        responseBody = {error: "User registered with a different password"};
                    }
                    break;
                case "join": //TODO: encriptar game tokens
                    let game = processJoinRequest(body, response);
                    if (game.indexOf(' ') == -1) 
                        responseBody = {game}; // All ok
                    else {
                        response.writeHead(game == "User registered with a different password" ? 401 : 400, {
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/javascript',
                            'Keep-Alive': 'timeout=5',
                            'Transfer-Encoding': 'chunked'
                        });
                        responseBody = {error: game};                        
                    }
                    break;
                case "notify":
                    let move = processNotifyRequest(body);
                    if (move >= 0) {
                        responseBody = {};
                    }
                    else {
                        response.writeHead(400);
                        // TODO, mudar o sistema de returns
                        switch (move) {
                            default:
                                error = "Erro!"
                                break;
                        }
                        responseBody = {error};
                    }
                    break;
                case "leave":
                    let returnCode = processLeaveRequest(body);
                    if (returnCode >= 0) {
                        responseBody = {};
                    }
                    else {
                        response.writeHead(400);
                        // TODO, mudar o sistema de returns
                        switch (returnCode) {
                            case -1:
                                error = "Invalid nick and password combination";
                                break;
                            case -2:
                                error = "Invalid game";
                                break;
                            default:
                                error = "Unspecified error";
                                break;
                        }
                        responseBody = {error};
                    }
                    break;
                default:
                    response.writeHead(400);
                    responseBody = {error};
                    break;
            }
        
            response.write(JSON.stringify(responseBody));
            response.end();
            return;
        case "GET":
            if (url.substring(0, 8) != "/update") {
                response.writeHead(404, {'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript'
                });
                responseBody = {error: "Invalid GET request URL"};
                response.write(JSON.stringify('error: Invalid GET request URL'));
                response.end();
            }

            let currentGameIndex, waitingQueueIndex, player1, player2, nick, game;
            let parsedUrl = parseUrl(url);

            if (parsedUrl == null) {
                response.writeHead(400, {'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript'
                });
                responseBody = {error: "Url incorrectly parsed"};
                response.write(JSON.stringify(responseBody));
                break;
            }  

            [nick, game] = parsedUrl;
            player1 = nick;
            player2 = nick;
                        
            currentGameIndex = Math.max(getIndex({player1, game}, currentGames), getIndex({player2, game}, currentGames));
            waitingQueueIndex = getIndex({nick, game}, waitingQueue);

            if (currentGameIndex == -1 && waitingQueueIndex == -1) { // If not found in neither
                response.writeHead(400, { 'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/javascript',
                    'Transfer-Encoding': 'chunked'
                });
                response.write(JSON.stringify({error: "Game not found"})); 
                response.end();
                return;   
            }

            response.writeHead(200, { 'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'text/event-stream',
                'Transfer-Encoding': 'chunked'
            });

            if (currentGameIndex == -1) { // If found in waiting queue
                waitingQueue[waitingQueueIndex].p1Resp = response;
            }
            else { // If found in current games
                currentGames[currentGameIndex].p2Resp = response;
                sendUpdateResponse(currentGameIndex);
            }
            break;
        default:
            response.writeHead(404);
            responseBody = {error: "Unknown request"};
            return;
    }

    // Sending html file as response
    /*
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('index.html', function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found');
        }
        else {
            res.write(data);
        }
        res.end();
    });
    */
});

function processRegisterRequest(body) {
    const {nick, password} = body;

    let userIndex = getIndex({nick}, loginCredentials);
    if (userIndex != -1) return (password == loginCredentials[userIndex].password);
    
    // const hash = crypto.createHash('md5').update(password).digest('hex'); TODO
    loginCredentials.push( {nick, password} )
    return true;
}

function processJoinRequest(body) {
    const {size, initial, group, nick} = body;

    if (!processRegisterRequest(body)) return "User registered with a different password";  
    if (!Number.isInteger(size)) return "Invalid size input";
    if (size < 2 || size > 6) return "Invalid size input";
    if (!Number.isInteger(initial)) return "Invalid initial input";
    if (initial < 1 || initial > 4) return "Invalid initial input";
    if (!Number.isInteger(group)) return "Invalid group input";

    let game;
    let queueIndex = getIndex( {size, initial, group} , waitingQueue);
    if (queueIndex != -1) { // If match was found
        let gameInfo = waitingQueue[queueIndex];

        game = gameInfo.game;
        let board = Array(size*2).fill(initial);
        let score = Array(2).fill(0);
        let player1 = gameInfo.nick;
        let player2 = nick;
        let p1Resp = gameInfo.p1Resp;
        let turn = player1;

        waitingQueue.splice(queueIndex, 1);
        currentGames.push({game, board, score, turn, player1, player2, p1Resp});

    }
    else {
        // const hash = crypto.createHash('md5').update(password).digest('hex'); TODO
        game = "";
        for (let i = 0; i < 32; i++) {
            let randomByte = Math.floor(Math.random()*16);
            game += randomByte.toString(16);
        }

        waitingQueue.push({size, initial, group, nick, game});
    }

    return game;

}

function processNotifyRequest(body) {
    let {nick, game, move} = body;
    let player1 = nick, player2 = nick;

    //TODO, mudar o sistema de returns 
    if (!processRegisterRequest(body)) return -1; // Invalid nick-password combination
    if (!Number.isInteger(move)) return -2; // Invalid input

    let gameIndex1 = getIndex({game, player1}, currentGames);
    let gameIndex2 = getIndex({game, player2}, currentGames);
    let gameIndex = Math.max(gameIndex1, gameIndex2);

    if (gameIndex == -1) return -3; // Player not in game

    let currentGame = currentGames[gameIndex];
    let {board, score, turn} = currentGame;
    player1 = currentGame.player1;
    player2 = currentGame.player2;

    let isPlayer1 = (nick == player1);
    if (!isPlayer1) move += board.length/2;  

    if (turn != nick) return -4; // Not your turn
    if (!(move in board)) return -5; // Pit index out of bound
    if (board[move] == 0) return -6; // Empty pit


    if (isPlayer1) { // 0..5
        if (0 > move || move >= board.length/2) return -7; // Pit not on player side
    } else { // 6..11
        if (board.length/2 > move || move > board.length) return -7; // Pit not on player side
    }

    // {game, board, score, turn, player1, player2, p1Resp, p2Resp}

    [currentGame.board, currentGame.score, isPlayer1] = executePlay(move, board, score, isPlayer1);
    currentGame.turn = isPlayer1 ? player1 : player2;

    sendUpdateResponse(gameIndex, move);
    return 0;


    /* //  TODO ver se é pra apagar isto
    eventEmitter.emit('updateGame', currentGame, nick, move);

    if (isGameFinished(board, score, isPlayer1)) {
        eventEmitter.emit('finishGame', currentGame);
        //TODO, Remover listeners dos eventEmitter
    }
    */
}

function processLeaveRequest(body) {
    const {nick, game} = body;

    //TODO, mudar o sistema de returns 
    if (!processRegisterRequest(body)) return -1; // Invalid username/password combination

    let queueIndex = getIndex( {game} , waitingQueue);
    if (queueIndex != -1) {
        waitingQueue[queueIndex].p1Resp.write(`data: ${JSON.stringify({winner: null})}\n\n`);
        waitingQueue.splice(queueIndex, 1);
        return 0;
    }

    let gameIndex = getIndex( {game}, currentGames);
    if (gameIndex != -1) {
        let {player1, player2, p1Resp, p2Resp} = currentGames[gameIndex];
        let winner = (nick == player1 ? {winner: player2} : {winner: player1});

        p1Resp.write(`data: ${JSON.stringify(winner)}\n\n`);
        p2Resp.write(`data: ${JSON.stringify(winner)}\n\n`);

        currentGames.splice(gameIndex, 1);
        return 0;
    }
    return -2; // Game not found
}

function getIndex(object, array) {
    for (let i = 0; i < array.length; i++) {
        let failed = false;

        for (let prop in object)
            if (array[i][prop] != object[prop]) {
                failed = true;
                break;
            }

        if (!failed) return i;
    }

    return -1;
}

function parseUrl(url) {
    if (url.substring(0, 13) != "/update?nick=") return;
    url = url.slice(13);

    const nameLen = url.indexOf("&");
    if (nameLen == -1) return;

    const name = url.substring(0, nameLen);
    url = url.slice(nameLen);

    if (url.substring(0, 6) != "&game=") return;

    return [name, url.slice(6)];
}

function executePlay(cavityIndex, b, s, isPlayer1) {

    var initialSeeds = b[cavityIndex];
    b[cavityIndex] = 0;
    var lastCavityWasStorage = false;

    for (var seeds = initialSeeds; seeds != 0; seeds--) {
        cavityIndex = (cavityIndex + 1) % b.length;

        var isPlayerStorage = (cavityIndex == (isPlayer1? (b.length/2) : 0));
        if (isPlayerStorage && !lastCavityWasStorage) {
            s[isPlayer1? 0 : 1]++;
            cavityIndex--;

            lastCavityWasStorage = true;
            continue;
        }

        b[cavityIndex]++;
        lastCavityWasStorage = false;
    }

    if (!lastCavityWasStorage) {
        verifyScoring(cavityIndex, b, s, isPlayer1);
        isPlayer1 = !isPlayer1;
    }

    return [b, s, isPlayer1];

}

function verifyScoring(cavityIndex, b, s, isPlayer1) {
    if ((isPlayer1 && cavityIndex < (b.length/2)) || (!isPlayer1 && cavityIndex >= (b.length/2))) {
        if (b[cavityIndex] == 1) {
            var oppositeCavity = b.length - cavityIndex - 1;

            s[isPlayer1 ? 0 : 1] += b[oppositeCavity] + 1;

            b[oppositeCavity] = 0;
            b[cavityIndex] = 0;
        }
    }
}

function isGameFinished(b, s, isPlayer1) {
    let onBoardSeedsCount = b.reduce((res, value) => res+value); 
    let totalSeeds = onBoardSeedsCount + s[0] + s[1];
    let minScoreToWin = totalSeeds / 2;

    if (Math.max(s[0], s[1]) > minScoreToWin)
        return true;

    let i = (isPlayer1 ? 0 : b.length/2);
    for (let j = 0; j < b.length/2; j++)
        if (b[i+j] != 0)
            return false;

    return true;
}

function sendUpdateResponse(currentGameIndex, cavityIndex) {
    let {p1Resp, p2Resp, board, score, turn, player1, player2} = currentGames[currentGameIndex];

    let boardCopy = board;

    let stores = {};
    stores[player1] = score[0];
    stores[player2] = score[1];

    let sides = {};
    sides[player1] = {store: score[0], pits: board.slice(0, board.length/2)};
    sides[player2] = {store: score[1], pits: board.slice(-board.length/2)};

    board = {turn: turn, sides: sides};


    //let data = (arguments.length > 1 ? {board, stores, pit: cavityIndex} : {board, stores});
    let data = {board, stores};
    if (arguments.length > 1) data.pit = cavityIndex;
    if (isGameFinished(boardCopy, score, (turn == player1))){
        if (score[0] > score [1]) {
            data.winner = player1;
        }
        else if (score[1] > score[0]) {
            data.winner = player2;
        }
        else data.winner = null;
    }
    // currentGame.score[0] += board.splice(0, board.length/2).reduce((res, value) => res+value);
    // currentGame.score[1] += board.reduce((res, value) => res+value);
    // {"board":{"turn":"edgar","sides":{"edgar":{"store":0,"pits":[4,4,4,4,4,4]},"sofia":{"store":0,"pits":[4,4,4,4,4,4]}}},"stores":{"edgar":0,"sofia":0}}
    
    p1Resp.write(`data: ${JSON.stringify(data)}\n\n`);
    p2Resp.write(`data: ${JSON.stringify(data)}\n\n`);
}

// TODO VER SE É PARA APAGAR TUDO ISTO OU NAO
// let eventEmitter = new events.EventEmitter();

/*
TODO: descobrir onde por estes headers
Access-Control-Allow-Origin: *
Cache-Control: no-cache
Connection: keep-alive
Content-Type: text/event-stream
*/

/*
eventEmitter.on('updateGame', function (currentGame, nick, move) {
    console.log('updateBoard event emitter called');
    let {player1, player2, board, score, turn} = currentGame;
    let isPlayer1 = (nick == player1);

    [board, score, isPlayer1] = executePlay(move, board, score, isPlayer1);
    currentGame[board] = board; //TODO usar . ou [] ??
    currentGame[score] = score; //TODO usar . ou [] ??
    currentGame[turn] = isPlayer1 ? player1 : player2; //TODO usar . ou [] ??

    //TODO como mandar para os listeners a mensagem e os headers
});

eventEmitter.on('finishGame', function (currentGame) {
    console.log('finishGame event emitter called');
    let {player1, player2, board, score} = currentGame;
    let winner;

    if (score[0] > score[1]) winner = player1;
    else if (score[1] > score[0]) winner = player2;
    else winner = null;

    if (winner) {
        //TODO add to leaderboard if good score
    }
})
*/

server.listen(port, function(error) {
    if (error) 
        console.log("Something went wrong");
    else 
        console.log("Listening on port " + port);
});
