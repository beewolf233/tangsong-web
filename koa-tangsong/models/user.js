import mongoose, { model } from 'mongoose';
import BaseDAO from '../lib/baseDAO';
const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
const userModel = mongoose.model('users', userSchema);
class userService extends BaseDAO {
	constructor(model) {
		super(model)
	}
}

module.exports = new userService(userModel);