/**
 * 如果require一个文件夹，里面没有任何配置的时候，默认的入口文件就是index.js文件：
 * 比如有一个people文件夹，如果require('./people')这样默认加载的是这个文件夹里面的index.js文件，
 * 当然这个入口文件可以通过package.json文件配置main属性来控制
 * Created by kevin on 18/3/14.
 */

// exports.TcpServer = require('./tcpServer.js');