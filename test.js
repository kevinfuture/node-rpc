'use strict';
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const RpcFactroy = require('./factory/rpcFactory');

RpcFactroy.read( (data) => {
    console.log('****',data.toString());
});
RpcFactroy.send('海贼王！！！');
