let mongoose = require('mongoose')

let merchSchema = new mongoose.Schema({
	// below
	item: {
		type: String,
		required:true
	},
	category: {
		type: String,
		required: true,
	},
	sex: {
		type: String,
		required: true,
	},
	collect: {
		type: String,
		required: false,
	},
	pre_order: {
		type: String,
		required: false,
	},
	members_only: {
		type: Boolean,
		required: false,
	},
	imgs: {
		type: Array,
		required: false,
	},
	price: {
		type: Number,
		required: true,
	},
	active: {
		type: Boolean,
		required: false
	},
	color: {
		type: String,
		required: false
	},
	no_size: {
		type: Boolean,
		required: false
	},
	description: {
		type: String,
		required: false
	}

});

module.exports = mongoose.model('Merch', merchSchema)