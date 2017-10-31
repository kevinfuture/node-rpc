const net = require('net');

// create tcp server
const server = net.createServer((conection) => {
    console.log('============== client connected !!! ============');
    conection.on('end',() =>{
        console.log('============ client disconnected !!! ============');
    })
    conection.write("测试server传输\r\n",'utf8');
    conection.pipe(conection);
});

// throwable
server.on('error', (err) => {
    throw  err;
})
// concurrent maxConnections
server.maxConnections = 100000;
// listen port
server.listen(80,'127.0.0.1', ()=>{
    console.log('========== listening port !!! ===========');
})