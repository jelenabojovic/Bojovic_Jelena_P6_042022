const http = require('http');
const https = require('https');

const server = http.createServer ((req, res) => {
    res.end('réponse su serveur');
});

server.listen(process.env.PORT || '3000');