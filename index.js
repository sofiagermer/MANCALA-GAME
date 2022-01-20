const http = require('http');
const events = require('events');
const fs = require('fs'); // TODO Sending html file as response
const crypto = require('crypto'); // TODO Create cryptos
const { eventNames } = require('process');
const port = 9028; 

let error;
let responseBody;
let gameEndedByPlay = false;
let gameEndedByLeave = false;
let successfulNotifyRequest = false;

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
    
    //console.log(JSON.parse(data).todo); // 'Buy the milk'
    /*
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk); 
        console.log("on data");
    }).on('end', () => {
        body = Buffer.concat(body).toString(); 
        console.log("on end");
        bodyTransferFinished = true;
        // Example: at login, body = {"nick":"sofia","password":"1234"}
    });
    */
    
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
                case "ranking":
                    responseBody = {ranking};
                    break;
                case "register":
                    if (processRegisterRequest(body)) {
                        responseBody = {};
                    }
                    else {
                        response.writeHead(400);
                        error = "Invalid nick and password combination";
                        //TODO fix error handling to response
                        responseBody = {error};
                    }
                    break;
                case "join":
                    let game = processJoinRequest(body, response);
                    if (game.indexOf(' ') == -1) 
                        responseBody = {game}; // All ok
                    else {
                        response.writeHead(400);
                        error = game;
                        responseBody = {error};                        
                    }
                    break;
                case "notify":
                    let move = processNotifyRequest(body);
                    if (move > 0) {
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
                    if (returnCode > 0) {
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
            let currentGameIndex, waitingQueueIndex, player1, player2;
            let parsedUrl = parseUrl(url);

            if (parsedUrl == null) {
                response.writeHead(400, {'Content-Type': 'application/javascript'});
                error = "Url incorrectly parsed";
                responseBody = {error};
                response.write(JSON.stringify(responseBody));
                break;
            }  

            [nick, game] = parsedUrl;
            player1 = nick;
            player2 = nick;
                        
            currentGameIndex = Math.max(getIndex({player1, game}, currentGames), getIndex({player2, game}, currentGames));
            waitingQueueIndex = getIndex({nick, game}, waitingQueue);

            if (currentGameIndex == -1 && waitingQueueIndex == -1) { // If not found in neither
                response.setHeader({'Content-Type': 'application/javascript'});
                error = "Game not found";
                responseBody = {error};
                response.write(JSON.stringify(responseBody));    
                break;
            }
            else if (currentGameIndex != -1) { // If found in current games
                // 2 players were linked, update both
                let {p1Resp, board, score, turn, player1, player2} = currentGames[currentGameIndex];
                //currentGames[currentGameIndex].p2Resp = response;

                let stores = {};
                stores[player1] = score[0];
                stores[player2] = score[1];

                let pit; // TODO URGENTEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

                let sides = {};
                sides[player1] = {store: score[0], pits: board.slice(0, board.length/2)};
                sides[player2] = {store: score[1], pits: board.slice(-board.length/2)};

                board = {turn: turn, sides: sides};


                let data = {board, stores, pit};
                // {"board":{"turn":"edgar","sides":{"edgar":{"store":0,"pits":[4,4,4,4,4,4]},"sofia":{"store":0,"pits":[4,4,4,4,4,4]}}},"stores":{"edgar":0,"sofia":0}}
                
                console.log(JSON.stringify(data));
                
                p1Resp.writeHead(200, { 'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'text/event-stream',
                    'Transfer-Encoding': 'chunked'
                });
                p1Resp.write(`data: ${JSON.stringify(data)}\n\n`);
                //p1Resp.end();

                response.writeHead(200, { 'Access-Control-Allow-Origin': '*',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Content-Type': 'text/event-stream',
                    'Transfer-Encoding': 'chunked'
                });
                response.write(`data: ${JSON.stringify(data)}\n\n`);
                //response.end();
            } else { // If found in waiting queue
                // Player is waiting for partner, return?
                waitingQueue[waitingQueueIndex].p1Resp = response;
            }
            break;
            /*
            console.log("Client opened connection");

            const timer = setInterval(() => {
                if (successfulNotifyRequest) {
                    successfulNotifyRequest = false;

                    if (gameEndedByLeave) {
                        responseBody = {winner};
                        clearInterval(timer);
                        gameEndedByLeave = false;
                    } 
                    else if (gameEndedByPlay) {
                        responseBody = {winner, board};
                        clearInterval(timer);
                        gameEndedByPlay = false;
                    } 
                    else 
                        responseBody = {board, score, turn}; //TODO mudar estrutura disto para como eles fizeram
                    
                    response.write(JSON.stringify(responseBody)); //TODO mudar responseBody para data? porque sse.onmessage(response) lê response.data
                }
                }, 1000);

            request.on('close', () => {
                console.log("Client closed connection");
                response.end(); 
            });
            */
        default:
            console.log("Wrong method called");
            response.writeHead(400);
            // TODO, deal with this
            responseBody = {error};
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

function processJoinRequest(body, response) {
    const {size, initial, group, nick} = body;

    if (!processRegisterRequest(body)) return "Invalid nick and password combination";  
    if (!Number.isInteger(size)) return "Invalid size input";
    if (size < 2 || size > 6) return "Invalid size input";
    if (!Number.isInteger(initial)) return "Invalid initial input";
    if (initial < 1 || initial > 4) return "Invalid initial input";
    if (!Number.isInteger(group)) return "Invalid group input";

    let game;
    let queueIndex = getIndex( {size, initial, group} , waitingQueue);
    if (queueIndex != -1) { // Match found
        let gameInfo = waitingQueue[queueIndex];

        game = gameInfo.game;

        let player1 = gameInfo.nick;
        let p1Resp = gameInfo.p1Resp;
        
        let player2 = nick;
        let player2Resp = response;
        
        let board = Array(size*2).fill(initial);
        let score = Array(2).fill(0);
        let turn = player1;

        // TODO, send SSE

        waitingQueue.splice(queueIndex, 1);
        currentGames.push({game, board, score, turn, player1, player2, p1Resp});

        /*
        player1Resp.write(JSON.stringify(responseBody));
        player1Resp.end();

        player2Resp.write(JSON.stringify(responseBody));
        player2Resp.end();
        */
    }
    else {
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

    // {x, y} = foo;
    // Is the equivalent to:
    // x = foo.x;
    // y = foo.y;

    const {nick, game, move} = body;
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
    player1 = currentGame.player1; // TODO usar . ou [] ??
    player2 = currentGame.player2; // TODO usar . ou [] ??

    if (turn != nick) return -4; // Not your turn
    if (!(move in board)) return -5; // Pit index out of bound
    if (board[move] == 0) return -6; // Empty pit

    let isPlayer1 = (nick == player1);

    if (isPlayer1) {
        if (turn >= board.length/2) return -7; // Pit not on player side
    } else {
        if (turn < board.length/2) return -7; // Pit not on player side
    }

    [board, score, isPlayer1] = executePlay(move, board, score, isPlayer1);
    currentGame.board = board; // TODO usar . ou [] ??
    currentGame.score = score; // TODO usar . ou [] ??
    currentGame.turn = isPlayer1 ? player1 : player2; // TODO usar . ou [] ??

    //TODO, send SSE
    successfulNotifyRequest = true;

    if (isGameFinished(board, score, isPlayer1)) {
        currentGame.score[0] += b.splice(0, board.length/2).reduce((res, value) => res+value);
        currentGame.score[1] += b.reduce((res, value) => res+value);
        gameEndedByPlay = true;
    }

    /* //  TODO ver se é pra apagar isto
    eventEmitter.emit('updateGame', currentGame, nick, move);

    if (isGameFinished(board, score, isPlayer1)) {
        eventEmitter.emit('finishGame', currentGame);
        //TODO, Remover listeners dos eventEmitter
    }
    */
}

function processLeaveRequest(body) {
    const {game} = body;

    //TODO, mudar o sistema de returns 
    if (!processRegisterRequest(body)) return -1;

    let gameIndex = getIndex( {game} , currentGames);
    if (gameIndex != -1) {
        // TODO, send SSE
        currentGames.splice(gameIndex, 1);
        gameEndedByLeave = true;
        return 0;
    }
    return -2;
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

    //TODO somo o board aqui?

    return true;
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
