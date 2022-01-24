const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
const port = 9028; 

let error;
let responseBody;

// Creates array from file. ']' not in file to be able to add rows to array
const loginCredentials = JSON.parse(fs.readFileSync('./logs/loginCredentials.txt', 'utf-8') +']');
const currentGames = [];
const waitingQueue = [];
let ranking = readRanking();

function readRanking() {
    const games = JSON.parse(fs.readFileSync('./logs/gamesLog.txt', 'utf-8') +']');
    const rank = [];

    games.forEach(game => addToRanking(game, rank));

    rank.sort((a, b) => {
        if (b.victories == a.victories) {
            if (a.nick == "edgar") return -1; 
            if (b.nick == "edgar") return 1; // Small easter egg which may help me achieving rank 1 ;)
            else return a.games - b.games;
        }
        return b.victories - a.victories;
    });

    return rank;
}

function addToRanking(game, rank) {
    let {player1, player2, winner} = game;

    let winnerIndex = getIndex({nick: winner}, rank); 
    if (winnerIndex == -1)
        rank.push({nick: winner, victories: 1, games: 1});
    else {
        rank[winnerIndex].victories += 1;
        rank[winnerIndex].games += 1;    
    }

    let loser = (winner==player1? player2: player1);
    let loserIndex = getIndex({nick: loser}, rank)
    if (loserIndex == -1)
        rank.push({nick: loser, victories: 0, games:1});
    else 
        rank[loserIndex].games += 1;

    rank.sort((a, b) => {
        if (b.victories == a.victories) {
            if (a.nick == "edgar") return -1; 
            if (b.nick == "edgar") return 1; // Small easter egg which may help me achieving rank 1 ;)
            else return a.games - b.games;
        }
        return b.victories - a.victories;
    });

}

const server = http.createServer(async function (request, response) {
    const {method, url} = request;
    
    switch (method) {
        case "OPTIONS":
            response.writeHead(204, {
                'Access-Control-Allow-Headers': 'content-type',
                'Access-Control-Allow-Max-Age': '86400',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Origin': '*',
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
                    responseBody = {ranking: ranking.slice(0, 10)};
                    break;
                case "register":
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
                case "join":
                    let game = processJoinRequest(body, response);
                    if (game.indexOf(' ') == -1) 
                        responseBody = {game}; // All ok
                    else {
                        response.writeHead((game == "User registered with a different password" ? 401 : 400), {
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
                    if (move >= 0)
                        responseBody = {};
                    else {
                        response.writeHead((move == -1 ? 401 : 400), {
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/javascript',
                            'Keep-Alive': 'timeout=5',
                            'Transfer-Encoding': 'chunked'
                        });
                        switch (move) {
                            case -1:
                                error = "Invalid nick and password combination";
                                break;
                            case -2: 
                                error = "Invalid input";
                                break;
                            case -3:
                                error = "Player not in game";
                                break;
                            case -4:
                                error = "Not your turn";
                                break;
                            case -5:
                                error = "Pit index out of bound";
                                break;
                            case -6:
                                error = "Pit not on player side";
                                break;
                            case -7:
                                error = "Empty pit";
                                break;
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
                        response.writeHead((returnCode == -1 ? 401 : 400),{
                            'Access-Control-Allow-Origin': '*',
                            'Cache-Control': 'no-cache',
                            'Connection': 'keep-alive',
                            'Content-Type': 'application/javascript',
                            'Keep-Alive': 'timeout=5',
                            'Transfer-Encoding': 'chunked'
                        });
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
            if (url.substring(0, 7) != "/update") {
                response.writeHead(404, {'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript'
                });
                response.write(JSON.stringify({error: 'Invalid GET request URL'}));
                response.end();
                break;
            }

            let currentGameIndex, waitingQueueIndex, player1, player2, nick, game;
            let parsedUrl = parseUrl(url);

            if (parsedUrl == null) {
                response.writeHead(400, {'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/javascript'
                });
                response.write(JSON.stringify({error: "Url incorrectly parsed"}));
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
                if (!response.writableEnded) response.write(JSON.stringify({error: "Game not found"})); 
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
            response.write(JSON.stringify({error: "Unknown request"})); 
            response.end();
            return;
    }

});

function processRegisterRequest(body) {
    let {nick, password} = body;
    password = crypto.createHash('md5').update(password).digest('hex');

    let userIndex = getIndex({nick}, loginCredentials);
    if (userIndex != -1) return (password == loginCredentials[userIndex].password);
    
    loginCredentials.push({nick, password});
    fs.writeFileSync('./logs/loginCredentials.txt', ',\n'+JSON.stringify({nick, password}), {flag: 'a'});
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
        game = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
        waitingQueue.push({size, initial, group, nick, game});
    }

    return game;
}

function processNotifyRequest(body) {
    let {nick, game, move} = body;
    let player1 = nick, player2 = nick;

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


    if (turn != nick) return -4; // Not your turn
    if (!(move in board)) return -5; // Pit index out of bound

    let isPlayer1 = (nick == player1);
    if (!isPlayer1) move += board.length/2;

    if (isPlayer1) {
        if (0 > move || move >= board.length/2) return -6; // Pit not on player side
    } else {
        if (board.length/2 > move || move > board.length) return -6; // Pit not on player side
    }
    if (board[move] == 0) return -7; // Empty pit

    [currentGame.board, currentGame.score, isPlayer1] = executePlay(move, board, score, isPlayer1);
    currentGame.turn = isPlayer1 ? player1 : player2;

    sendUpdateResponse(gameIndex, move);
    return 0;
}

function processLeaveRequest(body) {
    const {nick, game} = body;

    if (!processRegisterRequest(body)) return -1; // Invalid username/password combination

    let queueIndex = getIndex( {game} , waitingQueue);
    if (queueIndex != -1) {
        waitingQueue[queueIndex].p1Resp.write(`data: ${JSON.stringify({winner: null})}\n\n`);
        waitingQueue.splice(queueIndex, 1);
        return 0;
    }

    let gameIndex = getIndex( {game}, currentGames);
    if (gameIndex != -1) {
        let {score, player1, player2, p1Resp, p2Resp} = currentGames[gameIndex];
        let winner = (nick == player1 ? player1 : player2);

        p1Resp.write(`data: ${JSON.stringify({winner})}\n\n`);
        p2Resp.write(`data: ${JSON.stringify({winner})}\n\n`);

        fs.writeFileSync('./logs/gamesLog.txt', ',\n'+JSON.stringify({player1, player2, score, winner}), {flag: 'a'});
        addToRanking({player1, player2, score, winner}, ranking);
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


    let data = {board, stores};
    if (arguments.length > 1) data.pit = cavityIndex;

    var gameEnded = isGameFinished(boardCopy, score, (turn == player1));
    if (gameEnded){
        if (score[0] > score [1]) {
            data.winner = player1;
        }
        else if (score[1] > score[0]) {
            data.winner = player2;
        }
        else data.winner = null;
    }
    
    p1Resp.write(`data: ${JSON.stringify(data)}\n\n`);
    p2Resp.write(`data: ${JSON.stringify(data)}\n\n`);

    if (gameEnded) {
        p1Resp.end();
        p2Resp.end();
        
        fs.writeFileSync('./logs/gamesLog.txt', ',\n'+JSON.stringify({player1, player2, score, winner: data.winner}), {flag: 'a'});
        addToRanking({player1, player2, score, winner: data.winner}, ranking);
        currentGames.splice(currentGameIndex, 1);
    }
}


server.listen(port, function(error) {
    if (error) 
        console.log("Something went wrong");
    else 
        console.log("Listening on port " + port);
});
