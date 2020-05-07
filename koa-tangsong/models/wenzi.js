import mongoose from 'mongoose';
import BaseDAO from '../lib/baseDAO';
const Schema = mongoose.Schema;
const wenziSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    traditionname: {
        type: String,
        required: true
    },
    backpic: {
        type: String,
        required: true
    },
    pic: {
        type: String,
        required: true
    }
});
const wenziModel = mongoose.model('wenzi', wenziSchema);
class wenziService extends BaseDAO {
	constructor(model) {
		super(model)
	}
}

module.exports = new wenziService(wenziModel);