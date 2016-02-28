// app/models/todo.js

//load mongoose since we need it to define a model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = mongoose.Schema({
	owner: {type: Schema.Types.ObjectId, ref: 'User'},
	list: {type: Schema.Types.ObjectId, ref: 'List'},
	text: String,
	done: Boolean
});

module.exports = mongoose.model('Todo', todoSchema);