const mongoose = require('mongoose')
const validator = require('validator')
require('dotenv').config()

// Fetch MongoDB URI from environment variables
const url = process.env.MONGODB_URI

// Disable strict query for more flexibility
mongoose.set('strictQuery', false)

// Connect to MongoDB
mongoose.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

// Define the contact schema
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
		validate: [
			{
				validator: function(value) {
					// Allow empty email or valid email format
					return value === '' || /^\S+@\S+\.\S+$/.test(value)
				},
				message: 'Invalid email format'
			}
		]
	}
})

// Transform the document before converting to JSON
contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

// Export the Contact model using the contact schema
module.exports = mongoose.model('Contact', contactSchema)
