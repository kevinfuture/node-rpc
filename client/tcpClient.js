'use strict';
const net = require('net');
const client = new net.Socket();
const EventEmitter = require('events').EventEmitter;
const util = require('util');

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
class TcpClient {
    /**
     * if it is extend ,it must be extend super
     * // super();
     * **/
    constructor(options){
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
        this._client = null;
        //建立连接
        this.createClientConnect();
    }
    read(callback){
        return client.on('data',(data) => {
            return callback(data);
        });
    }
    send(data){
        client.write(data);
    }

    createClientConnect(){

        const params = {
            port: this.port,
            host: this.host
        }
        client.connect(params, ()=>{
            console.log('server ',client.remoteAddress,':',client.remotePort,'=============== connected to server !!! ================', client.address());
        });
        client.setNoDelay(true);
        client.setKeepAlive(true);
        client.on('readable  ',()=>{
            //读取操作，验证数据有效性，是否符合规则
        });
        client.on('writable ',()=>{
            //写入操作，验证写入数据有效性，是否符合规则
        });

        //发送fin报文段断开连接
        client.on('end',()=>{
            console.log('=========== disconnected !!! ==============');
        });
        client.on('error',(error)=>{
            console.log('client连接异常：',error)
        });
    }
}
util.inherits(TcpClient,EventEmitter);
module.exports = TcpClient;