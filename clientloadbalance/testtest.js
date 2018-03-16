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
console.log(server.send('11111111\n'));
const server1 = balance.getRandomTcpServer();
console.log(server1.send('222222\n'));
const server2 = balance.getRandomTcpServer();
console.log(server2.send('333333333\n'));
const server3 = balance.getRandomTcpServer();
console.log(server3.send('4444444444\n'));
const server4 = balance.getRandomTcpServer();
console.log(server4.send('555555555\n'));
const server5 = balance.getRandomTcpServer();
console.log(server5.send('66666666666\n'));
const server6 = balance.getRandomTcpServer();
console.log(server6.send('777777777777777\r\n'));