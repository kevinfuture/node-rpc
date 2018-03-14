const net = require('net');

const client = new net.Socket();
const PORT = 80;
const HOST = '127.0.0.1';

client.connect(PORT,HOST, ()=>{
   console.log('=============== connected to server !!! ================');
   client.write("客户端发送数据给服务端!!!\n")
});
client.on('data',(data) => {
    console.log('接受数据：',data.toString());
})
client.on('end',()=>{
    console.log('=========== disconnected !!! ==============');
})