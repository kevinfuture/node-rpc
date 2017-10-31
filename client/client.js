const net = require('net');

// create tcp client
const client = new net.Socket();
client.connect({port: 80}, ()=>{
   console.log('=============== connected to server !!! ================');
});
client.on('data',(data) => {
    console.log(data.toString());
    client.end();
})
client.on('end',()=>{
    console.log('=========== disconnected !!! ==============');
})