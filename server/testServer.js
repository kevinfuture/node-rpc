'use strict';
const TcpServer = require('./TcpServer');

const tcpServer = new TcpServer({
    host:'127.0.0.1',
    port:80
});
tcpServer.read((data) =>{
    console.log(data.toString())
});
tcpServer.send("my server !!\r\n");