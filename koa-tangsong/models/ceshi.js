import mongoose from 'mongoose';
import BaseDAO from '../lib/baseDAO';
const Schema = mongoose.Schema;
const ceshiSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
    // date: Date
});
const ceshiModel = mongoose.model('ceshi', ceshiSchema);
class ceshiService extends BaseDAO {
	constructor(model) {
		super(model)
	}
}

module.exports = new ceshiService(ceshiModel);