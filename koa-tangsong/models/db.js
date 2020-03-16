import mongoose from 'mongoose';
const DB_URL = 'mongodb://localhost:27017/local';
mongoose.connect(DB_URL);
mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open to' + DB_URL);
});
/**
 *  链接异常 error 数据库链接错误
 * */ 
mongoose.connection.on('error', (err) => {
    console.log('Mongoose connection error:' + err);
});
/**
 * 连接断开 disconnected 连接异常断开
 * */ 
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;