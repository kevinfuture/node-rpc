'use strict'
const EventEmitter = require('events').EventEmitter;
const util = require('util');


function heartBeat(rate){
    if(rate === null || rate === 'undefined'){
        //心跳频率，默认5秒
         rate = 5000;
    };
    setInterval(() => {
        //计算时间间隔，是否需要立即进行ping
        //如果时间间隔过大，则表示该句柄不可用，可以直接进行关闭
        //流控制，避免出现丢失等现象
        //获取当前时间，记录到tcpclient的socket上，然后发送心跳包
    }, rate );
}