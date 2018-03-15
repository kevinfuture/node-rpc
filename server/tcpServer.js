'use strict';
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const addressKey = Symbol('address');
const defaultOptions = {
    host: '127.0.0.1',
    port: 80,
    connectTimeout: 3000,
    maxConnections: 3000,
    allowHalfOpen: true,
    //允许共享连接处理任务
    // exclusive: false
};
class TcpServer{
    /**
     * if it is extend ,it must be extend super
     * // super();
     * **/
    constructor(options){
        EventEmitter.call(this);
        //shallow copy
        this.options = Object.assign(defaultOptions, options);

        console.assert(this.options.host, 'host is required !!!');
        console.assert(this.options.port, 'port is required!!!');

        this.port = this.options.port;
        this.host = this.options.host;
        this.connectTimeout = this.options.connectTimeout;
        this.maxConnections = this.options.maxConnections;
        this.allowHalfOpen = this.options.allowHalfOpen;
        this.exclusive = this.options.exclusive;

        //默认置为null
        this._socket = null;
        this._server = null;
        //建立连接
        this.createServerConnect();

        //读写操作则暴露给外部
    }

    //回调此处应该如何使用
    read(n, callback){
        this._server.on('data',(err, res) =>{
            console.log('server接受', this._socket.remoteAddress,'_', this._socket.remotePort,' : ',res.toString())
            callback(err, res);
        });
    }
    //回调此处应该如何使用
    send(data, callback){
        this._server.on('connection',(socket) => {
            socket.write(data)
            console.log();
        });
        return true;
    }

    createServerConnect(){
        const server = this._server = net.createServer((socket) => {
            console.log('client   protocal: ',socket.remoteFamily,'path: ', socket.remoteAddress,':', socket.remotePort);

            // this._socket = socket;
            // this._socket.setTimeout(3000);
            // this._socket.on('timeout',()=>{
            //     console.log('socket timeout');
            // });
            // //发送结束报文段fin
            // this._socket.on('end',() =>{
            //     console.log('============ client disconnected !!! ============');
            // })

            // //读取数据
            // this._socket.on('data',function (data) {
            //     console.log('server接受', socket.remoteAddress,'_', socket.remotePort,' : ',data.toString())
            // });
            // //写入数据
            // this._socket.write("hi，client！i am server\r\n",'utf8');

            // socket.on('readable  ',()=>{
            //     //验证是否允许 读操作
            //     console.log('server可读取！！！');
            // });
            // socket.on('writable ',()=>{
            //     //验证是否允许 写操作
            //     console.log('server可写入！！！');
            // });
            //此为双通道，会回传client传入数据再返回
            // socket.pipe(socket);
        });



        // //读取数据
        // this._server.on('data',function (data) {
        //     console.log('server接受', socket.remoteAddress,'_', socket.remotePort,' : ',data.toString())
        // });
        //写入数据 必须监听一个事件
        // this._server.on('需要监听一个事件，然后拿到socket',(socket) =>{
        //     socket.write("hi，client！i am server\r\n",'utf8');
        // });



        this._server.maxConnections = defaultOptions.maxConnections;
        this._server.allowHalfOpen = true;
        //监听对应ip端口,参数：端口，ip，backlog（文件描述符支持的最大待连接队列数，包括未连接队列与已连接队列，指三次握手的其中两个阶段）
        const params = {
            port: this.port,
            host: this.host,
            //这个大小应该够用，默认应该是511 backlog: 512,
            // exclusive: this.exclusive === null?false:true,
        }
        this._server.listen(params, ()=>{
            console.log('opened server on', server.address());
        });
        this._server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log('Address in use, retrying...');
                setTimeout(() => {
                    server.close();
                    server.listen(this.port, this.host);
                }, 1000);
            }
        })
    }
}
util.inherits(TcpServer,EventEmitter);
module.exports = TcpServer;