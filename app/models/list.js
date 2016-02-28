// app/models/list.js

//load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = mongoose.Schema({
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	listTitle: String,
	todos: [{type: Schema.Types.ObjectId, ref: 'Todo'}]
});

module.exports = mongoose.model('List', listSchema);