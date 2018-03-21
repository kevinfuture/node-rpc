'use strict';
const net = require('net');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

const defaultOptions = {
    //nagle算法要求，tcp连接上最多只能一个未被确认的ack，到达前不允许发送分组（有利有弊：弊端就是慢，默认不开启）
    noDelay : true,
    connectTimeout: 3000,
    responseTimeout: 3000,
    heartbeatInterval: 5000,
    needHeartbeat: true,
    concurrent: 0,
    reConnectTimes: 0,
    reConnectInterval: 1000,
    maxConnections: 10000,
    allowHalfOpen: true
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
        this.options = null;

        //默认：否则当创建多个句柄的实例时候，共享了一个句柄创建过程就会冲突，并失败
        this._client = new net.Socket();

        //建立连接
        const params = {
            port: this.port,
            host: this.host
        }
        this._client.connect(params, () => {
            console.log('server ',this._client.remoteAddress,':',this._client.remotePort,'=============== connected to server !!! ================', this._client.address());
        });
        this._client.setNoDelay(true);
        this._client.setKeepAlive(true);
        // this._client.setTimeout(this.connectTimeout);
        this._client.on('readable  ',() => {
            //读取操作，验证数据有效性，是否符合规则
        });
        this._client.on('writable ',() => {
            //写入操作，验证写入数据有效性，是否符合规则
        });
        //发送fin报文段断开连接
        this._client.on('end',() => {
            console.log('=========== disconnected !!! ==============');
        });
        this._client.on('error',(error) => {
            // this._client.destroy();
            //监听到服务端发生异常时，会直接销毁该socket
            console.log(error.address + ':' + error.port,'socket创建异常：', error.errno,' ', error.syscall);
        });
    }

    read(callback){
        //读取超时：要进行重连操作
        let start = Date.now();
        return this._client.on('data',(data) => {
            let end = Date.now();

            //需要对data进行解码操作；request
            return callback(data);
        });
    }
    send(data){
        //写入超时：进行重连操作
        let start = Date.now();

        //需要对data进行编码操作；response
        this._client.write(data);
        let end = Date.now();
    }
}
util.inherits(TcpClient,EventEmitter);
module.exports = TcpClient;