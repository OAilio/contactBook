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
		validate: {
			validator: function(value) {
				return value.length >= 3
			},
			message: 'Name must be at least 3 characters long'
		}
	},
	number: {
		type: String,
		maxlength: 15,
		required: true,
		validate: {
			validator: function(value) {
				return /^[0-9+\-()\s#*]+$/.test(value)
			},
			message: 'Invalid phone number format'
		}
	},
	email: {
		type: String,
		required: false,
		match: /^\S+@\S+\.\S+$/,
		validate: {
			validator: function(value) {
				return /^\S+@\S+\.\S+$/.test(value)
			},
			message: 'Invalid email format'
		}
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