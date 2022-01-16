const http = require('http');
const fs = require('fs'); // Sending html file as response
const port = 9028; 

let error;

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

            let responseBody;
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
                        responseBody = {error};
                    }
                    break;
                case "join":
                    let game = processJoinRequest(body);
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
                    // TODO, tenso
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
        default:
            console.log("Wrong method called");
            response.writeHead(400);
            // TODO, deal with this
            responseBody = {error};
            return;
    }
    /*
    return;
    if (method === 'OPTIONS') {
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
    }

    if (method === 'POST') {
        response.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/javascrript',
            'Keep-Alive': 'timeout=5',
            'Transfer-Encoding': 'chunked'
        });
        const responseBody = { ranking };
    
        response.write(JSON.stringify(responseBody));
        response.end();
        return;
    }

    return;

    res.writeHead(405, headers);
    res.end(`${req.method} is not allowed for the request.`);
    return;

    if (method == 'OPTIONS') {
        response.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Request-Headers': 'content-type',
            'Access-Control-Request-Method': 'OPTIONS, POST',
            'Content-Type': 'application/json',
            'Sec-Fetch-Mode': 'cors'
        })
        console.log("options request received");
        const responseBody = { headers, method, url, body };
    
        response.write(JSON.stringify(responseBody));
        response.end();
        return;
    }

    if (method == 'POST') {
        res.writeHead(200, headers);
        res.end('Hello World');
        return;
    }
    if (false) {
        response.on('error', (err) => {
            console.error(err);
        })
    
        //response.writeHead(200, {'Content-Type': 'text/plain'});
        response.writeHead(200, {'Content-Type': 'application/json'})
        
        const responseBody = { headers, method, url, body };
    
        response.write(JSON.stringify(responseBody));
        response.end();
    }
    */

    /*
    for (let attr in request) {
        response.write(attr + " = " + request.attr + "\n");
    }

    response.write("method = " + method + "\n");
    response.write("url = " + url + "\n");
    response.write("headers = " + headers + "\n");
    response.end();
    */

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

function handleRequest (method, url, headers, body) {

}

function processRegisterRequest(body) {
    const {nick, password} = body;

    let userIndex = loginCredentials.indexOf( {nick} ); //TODO, por isto a funcionar
    if (userIndex != -1) return (password == loginCredentials[i].password); //TODO verificar se é . ou []
    
    loginCredentials.push( {nick, pass} )
    return true;
}

function processJoinRequest(body) {
    const {size, initial, group, name} = body;

    if (!processRegisterRequest(body)) return "Invalid nick and password combination";  
    if (!Number.isInteger(size)) return "Invalid size input";
    if (size < 2 || size > 6) return "Invalid size input";
    if (!Number.isInteger(initial)) return "Invalid initial input";
    if (initial < 1 || initial > 4) return "Invalid initial input";
    if (!Number.isInteger(group)) return "Invalid group input";

    let game = "";
    for (let i = 0; i < 32; i++) {
        let randomByte = Math.floor(Math.random()*16);
        game += randomByte.toString(16);
    }

    let queueIndex = waitingQueue.indexOf( {size, initial, group} ); //TODO, por isto a funcionar
    if (queueIndex != -1) {
        game = waitingQueue[queueIndex].game; //TODO verificar se é . ou []
        let player1 = waitingQueue[queueIndex].name; //TODO verificar se é . ou []
        let player2 = name;
        
        // TODO, send SSE

        waitingQueue.splice(queueIndex, 1);
        currentGames.push( {game, player1, player2} ); //TODO por o board na db?
    }
    else waitingQueue.push( {size, initial, group, name, game} );

    return game;

}

function processNotifyRequest(body) {
    const {game, move} = body;
    const player1, player2 = body.nick; //TODO verificar se é . ou []

    //TODO, mudar o sistema de returns 
    if (!processRegisterRequest(body)) return -1;
    if (!Number.isInteger(move)) return -2;

    let gameIndex1 = currentGames.indexOf( {game, player1}); //TODO, por isto a funcionar
    let gameIndex2 = currentGames.indexOf( {game, player2}); //TODO, por isto a funcionar

    if (gameIndex1 != -1 || gameIndex2 != -1) {
        // TODO get board from db or?
        return 0;
    }
    return -3;
}

function processLeaveRequest(body) {
    const {game} = body;

    //TODO, mudar o sistema de returns 
    if (!processRegisterRequest(body)) return -1;

    let gameIndex = currentGames.indexOf( {game} ); //TODO, por isto a funcionar
    if (gameIndex != -1) {
        // TODO, send SSE
        currentGames.splice(gameIndex, 1);
        return 0;
    }
    return -2;
}

server.listen(port, function(error) {
    if (error) 
        console.log("Something went wrong");
    else 
        console.log("Listening on port " + port);
});
