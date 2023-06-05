//THIS FILE NEEDS MODIFICATIONS, AS OF NOW IT WONT WORK PROPERLY
const mongoose = require('mongoose')

if (process.argv.length<3) {
	console.log('give password as argument')
	process.exit(1)
}

if (process.argv.length === 4) {
	console.log('Invalid contact!')
	process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
	email: String
})

const Contact = mongoose.model('Contact', contactSchema)

const contact = new Contact({
	name: process.argv[3],
	number: process.argv[4],
	email: process.argv[5]
})

if (process.argv.length === 5){
	contact.save().then(result => {
		console.log(`Added ${contact.name} number ${contact.number} to phonebook`)
		mongoose.connection.close()
	})
}

if (process.argv.length === 3){
	console.log('Phonebook:')
	Contact.find({}).then(result => {
		result.forEach(contact => {
			console.log(`${contact.name} ${contact.number}`)
		})
		mongoose.connection.close()
	})
}