'use strict';
const LoadBalance = require('./balance');
const TcpClient = require('../client/tcpClient');


const tcpClient1 =  new TcpClient({
    host:'127.0.0.1',
    port:80
});
const tcpClient3 =  new TcpClient({
    host:'127.0.0.1',
    port:83
});

const serverPool = [
    tcpClient1,
    tcpClient3
];

/**
 * 心跳处理
 * 需要定期的把所有不可用的服务从serverPool移除
 * **/
const balance = new LoadBalance({
    serverPool: serverPool
});
const server = balance.getRandomTcpServer();
server.send('11111111\n');

const server1 = balance.getRandomTcpServer();
server1.send('222222\n');

const server2 = balance.getRandomTcpServer();
server2.send('333333333\n');

const server3 = balance.getRandomTcpServer();
server3.send('4444444444\n');

const server4 = balance.getRandomTcpServer();
server4.send('555555555\n');

const server5 = balance.getRandomTcpServer();
server5.send('66666666666\n');

const server6 = balance.getRandomTcpServer();
console.log(server6.send('777777777777777\r\n'));