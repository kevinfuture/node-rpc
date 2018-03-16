'use strict';
const LoadBalance = require('./balance');
const TcpClient = require('../client/tcpClient');

const serverPool = [
    new TcpClient({
        host:'127.0.0.1',
        port:80
    }),
    new TcpClient({
        host:'127.0.0.1',
        port:83
    })
];
const balance = new LoadBalance({
    serverPool: serverPool
});
const server = balance.getRandomTcpServer();
console.log(server.port);