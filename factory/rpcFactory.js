'use strict';
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const LoadBalance = require('../clientloadbalance/balance');
const TcpClient = require('../client/tcpClient');

function getServer( callback ){
    const tcpClient1 =  new Promise( (resolve, reject) => {
        resolve(
            new TcpClient({
                host:'127.0.0.1',
                port:80
            })
        );
    });

    const tcpClient3 =  new Promise( (resolve, reject) => {
        resolve(
            new TcpClient({
                host:'127.0.0.1',
                port:83
            })
        );
    });

    Promise.all( [ tcpClient1,tcpClient3 ])
        .then( (serverPool) => {
            return callback(
                new LoadBalance({serverPool: serverPool}).getRandomTcpServer()
            );
        });
};

function read(callback) {
    getServer(( server ) => {
        return server.read( (data) => {
            return callback(data);
        })
    });
}
function send(data){
    return getServer(( server ) => {
        server.send(data);
    });
}

// util.inherits(???,EventEmitter);
 module.exports = {
     send: send,
     read: read
 };
