import mongoose from 'mongoose';
import { mongoDB } from '../config'
const options = {
    autoReconnect: true
};
const DB_URL = 'mongodb://' +
mongoDB.host + ':' + mongoDB.port + '/' + mongoDB.db;
// const DB_URL = 'mongodb://localhost:27017/local';
module.exports = {
    connect: ()=> {            
        mongoose.connect(DB_URL, options)
        let db = mongoose.connection;
        db.on('connected', () => {
            console.log('Mongoose connection open to' + DB_URL);
        });
        db.on('error', console.error.bind(console, '连接错误:'));
        db.once('open', ()=> {
            console.log('mongodb connect suucess');
        });
        db.on('disconnected', () => {
                console.log('Mongoose connection disconnected');
        });
    }
};