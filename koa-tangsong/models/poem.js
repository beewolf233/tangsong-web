import mongoose from 'mongoose';
import BaseDAO from '../lib/baseDAO';
const Schema = mongoose.Schema;
const poemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    book: {
        type: String
    },
    auther: {
        type: String,
        required: true
    },
    descript: {
        type: String,
        required: true
    }
    // date: Date
});
const poemModel = mongoose.model('poem', poemSchema);
class poemService extends BaseDAO {
	constructor(model) {
		super(model)
	}
}

module.exports = new poemService(poemModel);