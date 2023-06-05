const mongoose = require('mongoose')
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

const capitalizeName = (name) => {
	return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
}

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		minlength: 3,
		required: true,
		set: capitalizeName
	},
	number: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false
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