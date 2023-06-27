const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

//console.log('MONGODB_URI:', process.env.MONGODB_URI)

mongoose.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
	},
	number: {
		type: String,
		maxlength: 15,
		required: true
	},
	email: {
		type: String,
		required: false,
		match: /^\S+@\S+\.\S+$/,
	}

})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)