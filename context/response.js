'use strict';
const EventEmitter = require('events').EventEmitter;
const util = require('util');

class Response{
    constructor(options){
        //定义消息头消息体，与消息尾
        this.header = '';
        this.body = '';
        this.end = '';
    }
}