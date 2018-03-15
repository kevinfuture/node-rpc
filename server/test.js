'use strict';
const TcpServer = require('./TcpServer');

const tcpServer = new TcpServer({
    host:'127.0.0.1',
    port:80
});
//读取100个字节
tcpServer.read(100,(err, res) =>{
    console.log('接收数据：', res)
});
tcpServer.send("海贼王！！\r\n");