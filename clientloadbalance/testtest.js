'use strict';
const LoadBalance = require('./balance');

const serverPool = [2,4,6,8];
const balance = new LoadBalance({serverPool:serverPool});
const server = balance.getRandomTcpServer();
console.log(server);