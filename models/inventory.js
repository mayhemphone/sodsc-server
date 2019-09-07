let mongoose = require('mongoose')

let inventorySchema = new mongoose.Schema({
	merchId:{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Merch'
	},
	size: {
		type: String,
		required: true,
	},
	count: {
		type: Number,
		required: true,
	}

});

module.exports = mongoose.model('Inventory', inventorySchema)