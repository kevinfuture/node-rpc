'use strict'
const EventEmitter = require('events').EventEmitter;
const util = require('util');


function heartBeat(rate){
    if(rate === null || rate === 'undefined'){
        //心跳频率，默认5秒
         rate = 5000;
    };
    setInterval(() => {
        const duration = this._lastHeartbeatTime - this._lastReceiveDataTime;
        if (this._lastReceiveDataTime && duration > this.options.heartbeatInterval) {
            const err = new Error(`server ${this[addressKey]} no response in ${duration}ms, maybe the socket is end on the other side.`);
            err.name = 'ServerNoResponseError';
            this.close(err);
            return;
        }
        // flow control
        if (this._invokes.size > 0 || !this.isOK) {
            return;
        }
        this._lastHeartbeatTime = Date.now();
        this.sendHeartBeat();
    }, rate );
}