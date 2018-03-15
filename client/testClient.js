'use strict';
const TcpClient = require('./TcpClient');


const tcpClient = new TcpClient({
    host:'127.0.0.1',
    port:80
});
tcpClient.read((data) =>{
    console.log('服务端数据：',data.toString());
});
tcpClient.send('haizeiwangaaaa!!!');