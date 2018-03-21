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
    //允许共享连接处理任务  exclusive: false
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
        this._clientQueue = [];
        //建立连接
        this.createServerConnect();
    }

    //读写操作则暴露给外部
    read(callback){
        //实际上不应该每次都去监听，不过确认的是这样用，每次连接都只创建了一次，不知道这样会不会有问题
        //应该有问题 to do ，再考虑实现；临时防范，将截获的数据返回给socket，再将socket的数据返回给回调函数
        this._server.on('connection',(socket) => {
            if(!socket.readable){
                socket.destroy();
            }else{
                return socket.on('data',(data) => {
                    data = '['+ socket.remoteAddress + ':' + socket.remotePort + ']：' + data;
                    return callback(data);
                });
            }
        });
    };
    send(data){
        this._server.on('connection',(socket) => {
            if(!socket.writable){
                socket.destroy();
            }else{
                socket.write(data);
            }
        });
    }

    createServerConnect(){
        const server = this._server = net.createServer((socket) => {
            this._socket = socket;
            console.log('client protocal: ',socket.remoteFamily,'; path：', socket.remoteAddress,':', socket.remotePort);
            socket.on('readable', ()=>{
                try {
                    //进行读取的数据校验
                    console.log('可读取！！！');
                } catch (err) {
                    console.error(err);
                }
            });
            socket.on('writeable', ()=>{
                try {
                    //进行写入的数据校验
                    console.log('可写入！！！');
                } catch (err) {
                    console.error(err);
                }
            });
            socket.on('end',()=>{
               console.log('client['+ socket.remoteAddress+':'+socket.remotePort+']：lost connect!!!' );
            });
            socket.on('error',(error)=>{
                console.log('socket异常：',error.errno,' ', error.syscall);
            });
        });

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
        this._server.on('error', (error) => {
            console.log('server异常: ',error)
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