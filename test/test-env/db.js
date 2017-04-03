const mongoose = require('mongoose');

mongoose.Promise = require('bluebird');
const connection = mongoose.createConnection('mongodb://localhost:27017/mongoose-amqp-events');

const schema = new mongoose.Schema({ text: String });
mongoose.model('post', schema);

module.exports = connection;
