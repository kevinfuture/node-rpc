'use strict'
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const net = require('net');
const TcpClient = require('../client/tcpClient');

class HeartBeat {
    constructor(options){
        console.assert(options.serverPool, 'serverPool is null！');
        this._serverPool = options.serverPool;
        this._connectTimeout = options._connectTimeout;
        if( this._connectTimeout === null || this._connectTimeout === undefined ){
            this._connectTimeout = 6000;
        }

        this._reConnectInterval = options.reConnectInterval;
        if( this.reConnectInterval === null || this.reConnectInterval == undefined ){
            this._reConnectInterval = 1000 * 60;
        }
        this._rate = options.rate;
        if(this._rate === null || this._rate === undefined){
            //心跳频率，默认5秒
            this._rate = 5000;
        };

        /**
         * 初始化
         * 使用一个map查看链接状态
         * key：ip_port
         * value：重连次数，默认为0次
         * **/
        this.allServer = new Map();
        const _allServer = this.allServer;
        this._serverPool.forEach( function(_client, index){
            const address = _client.host + '_' +_client.port;
            //默认认为都不是活跃的，-1
            _allServer.set(address , 0);
        });

       this.heartBeat();
    }
    /**
     * @param serverPool tcp客户端的连接池
     * @param rate 心跳频率
     * **/
    heartBeat(){
        //一、心跳检测
        setInterval(() => {
            console.log('心跳检测： ');
            let _serverPool = this._serverPool;

            // const _connectTimeout = this._connectTimeout;

            this._serverPool.forEach( function(_client, index){
                console.log(_client.host, ' : ',_client.port);
                let tcpClient = null;
                try{
                    //对新连接进行ping-pong操作，看server是否keepAlive
                    tcpClient = new TcpClient({
                        host: _client.host,
                        port: _client.port
                    });
                    tcpClient._client.end();
                    tcpClient._client.on('error',(error)=>{
                        //ping不通的话则移除连接池中的该节点
                        for(var i = 0; i <_serverPool.length; i++){
                            if(_serverPool[i] == _client){
                                _serverPool.splice(i,1);
                                break;
                            }
                        }
                    });

                    /**
                     * 监听“原连接”超时事件，看server是否keepAlive；
                     * 此处应该与服务端进行定制性的交互，考虑到跨语言情况下的server端没有定制该信息，所以暂时注释掉
                     */
                    // _client.on('timeout',()=>{
                    //     console.log('连接超时，不可用！！！');
                    //     tcpClient._client.end();
                    //     if(tcpClient != null){
                    //         _disconnectedQueue.push(tcpClient);
                    //     }
                    // //ping不通的话则移除连接池中的该节点
                    // for(var i = 0; i <_serverPool.length; i++){
                    //     if(_serverPool[i] == _client){
                    //         _serverPool.splice(i,1);
                    //         break;
                    //     }
                    // }
                    // });
                } catch (error){
                    //ping不通的话则移除连接池中的该节点
                    for(var i = 0; i <_serverPool.length; i++){
                        if(_serverPool[i] == _client){
                            _serverPool.splice(i,1);
                            break;
                        }
                    }
                    console.log('client连接异常：',error,' 移除当前连接，进行重连操作！')
                }
            });

            //计算时间间隔，是否需要立即进行ping
            //如果时间间隔过大，则表示该句柄不可用，可以直接进行关闭
            //流控制，避免出现丢失等现象
            //获取当前时间，记录到tcpClient的socket上，然后发送心跳包
        }, this._rate );
        //二、重连操作
        setInterval(()=>{
            if(this.allServer){
                const _serverPool = this._serverPool;

                //此处时间复杂度与空间复杂度都非常高，要考虑优化掉
                outer:
                for( let [address, reConnectCount] of this.allServer){
                    if(_serverPool.length > 0){
                        inter:
                            for(var i = 0; i <_serverPool.length; i++){
                                const key = _serverPool[i].host + '_' + _serverPool[i].port;
                                if( address !== key){
                                    this.reConnect(_serverPool, address, reConnectCount);
                                    continue outer;
                                }
                            }
                    }else{
                        this.reConnect(_serverPool, address, reConnectCount);
                    }
                }

            }
        },10000);
    }

    reConnect(_serverPool, address, reConnectCount){
        console.log('当前不可用连接：', address, '进行第', reConnectCount ,'次重连操作 ！');
        const thisHost = address.split('_')[0];
        const thisPort = address.split('_')[1];
        let tcpClient = null;
        try{
            tcpClient = new TcpClient({
                host: thisHost,
                port: thisPort
            });

            this.allServer.set(address,++reConnectCount);
            _serverPool.push(tcpClient);

            //如果发生异常事件，则再次移除，此处处理确实不好，先实现一个草版；再优化
            tcpClient._client.on('error',(error) => {
                for(var i = 0; i <_serverPool.length; i++){
                    if(_serverPool[i].host === thisHost &&_serverPool[i].port === thisPort){
                        _serverPool.splice(i,1);
                        break;
                    }
                }
            });
        } catch (error){
            this.allServer.set(address,++reConnectCount)
            console.log(tcpClient._client.address(), '重连失败！');
        }
    }
}
util.inherits(HeartBeat,EventEmitter);
module.exports = HeartBeat;