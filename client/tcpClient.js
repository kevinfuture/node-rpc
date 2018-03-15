'use strict';
const net = require('net');
const client = new net.Socket();

const defaultOptions = {
    //nagle算法要求，tcp连接上最多只能一个未被确认的ack，到达前不允许发送分组（有利有弊：弊端就是慢，默认不开启）
    noDelay : true,
    connectTimeout: 3000,
    responseTimeout: 3000,
    heartbeatInterval: 10000,
    needHeartbeat: true,
    concurrent: 0,
    reConnectTimes: 0,
    reConnectInterval: 1000,
    maxConnections: 100000,
    allowHalfOpen: true,
    logger: console
};
const params = {
    port: 80,
    host: '127.0.0.1'
}
client.connect(params, ()=>{
   console.log('server ',client.remoteAddress,':',client.remotePort,'=============== connected to server !!! ================', client.address());
});
client.setNoDelay(true);
client.setKeepAlive(true);
client.on('readable  ',()=>{
    //验证是否允许 读操作
    console.log('可读取！！！');
});
client.on('writable ',()=>{
    //验证是否允许 写操作
    console.log('可写入！！！');
});
client.on('data',(data) => {
    console.log('client接受：',data.toString());
});
client.write("hi,server！i am client!!!\n");

//发送fin报文段断开连接
client.on('end',()=>{
    console.log('=========== disconnected !!! ==============');
});
client.on('error',(error)=>{
    throw error;
});