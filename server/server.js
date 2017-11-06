const net = require('net');

const PORT = 80;
const HOST = '127.0.0.1';

const server = net.createServer((socket) => {
    console.log('============== client connected !!! ============');
    socket.on('data',function (data) {
        console.log(socket.remoteAddress,socket.remotePort,'服务端接受：',data.toString())
        socket.write("服务端发送传输给客户端\r\n",'utf8');
    })
    socket.on('end',() =>{
        console.log('============ client disconnected !!! ============');
    })
});

server.on('error', (err) => {
    throw  err;
})
server.maxConnections = 100000;
server.listen(PORT,HOST, ()=>{
    console.log('========== listening port !!! ===========',HOST,':',PORT);
})