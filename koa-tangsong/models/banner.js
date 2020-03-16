import mongoose from 'mongoose';
import BaseDAO from '../lib/baseDAO';
const Schema = mongoose.Schema;
const bannerSchema = new Schema({
    banner: {
        type: String,
        required: true
    }
});
const bannerModel = mongoose.model('banner', bannerSchema);
class bannerService extends BaseDAO {
	constructor(model) {
		super(model)
	}
}

module.exports = new bannerService(bannerModel);