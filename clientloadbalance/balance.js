'use strict'
const crypto = require('crypto');
const EventEmitter = require('events').EventEmitter;
const util = require('util');

class LoadBalance{

    constructor(options){
        console.assert(options.serverPool, 'it"s no server in loadBalance!!!')
        this.serverPool = options.serverPool;
    }

    /**
     * docker化后，容器一致，基本硬件一致，采用此种方式实现最为简单
     * 潜在危险是：如果server挂掉一台，则无法抛弃，后续考虑抛弃策略
     * 随机负载方式
     * **/
    getRandomTcpServer() {
        if(this.serverPool == null || this.serverPool.length <= 0){
            return null;
        }
        const serverLen = this.serverPool.length;
        const index = crypto.randomBytes(1)[0] % serverLen;

        if(index < 0 || index > serverLen){
            throw new Error('not found server，it"s probability error or overflow!!!' );
        }

        return this.serverPool[index];
    }

    /**
     * 最快响应法负载方式，后期优化考虑实现
     * **/
}

util.inherits(LoadBalance, EventEmitter);

module.exports = LoadBalance;