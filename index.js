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

const server = http.createServer(function (request, response) {
    
    const { method, url, headers } = request;
    // Example: at login, method = "POST", url = "/login", headers = array { lowercase request headers: value}

    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString(); // Example: at login, body = {"nick":"sofia","password":"1234"}
    });
    
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
            response.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Type': 'application/javascrript',
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
                        responseBody = {error};
                    }
                    break;
                case "join":
                    let gameToken = processJoinRequest(body);
                    if (gameToken != 0) {
                        responseBody = {game};
                    }
                    else {
                        response.writeHead(400);
                        responseBody = {error};                        
                    }
                    break;
                case "notify":
                    // TODO, tenso
                    break;
                case "leave":
                    if (processLeaveRequest(body)) {
                        responseBody = {};
                    }
                    else {
                        response.writeHead(400);
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
            console.log("wrong method called");
            response.writeHead(400);
            responseBody = {error};
            return;
    }
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

server.listen(port, function(error) {
    if (error) 
        console.log("Something went wrong");
    else 
        console.log("Listening on port " + port);
});
