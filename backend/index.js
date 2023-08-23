const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
require('dotenv').config()

const app = express()

// Middleware
app.use(express.json()) // Parse JSON request bodies
app.use(express.static('build')) // Serve static files
app.use(morgan('tiny')) // Logger
app.use(cors()) // Enable Cross-Origin Resource Sharing (CORS)

// Route for the root URL
app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

// Get all contacts
app.get('/api/persons', (req, res, next) => {
	Contact.find({})
		.then(contacts => {
			res.json(contacts)
		})
		.catch(error => next(error))
})

// Get a specific contact by ID
app.get('/api/persons/:id', (req, res, next) => {
	Contact.findById(req.params.id)
		.then(contact => {
			if (contact) {
				res.json(contact)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

// Update a contact by ID
app.put('/api/persons/:id', (req, res, next) => {
	const { name, number, email } = req.body

	const contact = {
		name,
		number,
		email
	}

	Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
		.then(updatedContact => {
			if (updatedContact) {
				res.json(updatedContact)
			} else {
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

// Add a new contact
app.post('/api/persons', (req, res, next) => {
	const body = req.body

	const contact = new Contact({
		name: body.name,
		number: body.number,
		email: body.email
	})

	contact.save()
		.then(savedContact => {
			res.json(savedContact)
		})
		.catch(error => next(error))
})

// Delete a contact by ID
app.delete('/api/persons/:id', (req, res, next) => {
	Contact.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

// Route to get info about the phonebook
app.get('/info', (req, res, next) => {
	Contact.countDocuments({})
		.then(count => {
			const currentTime = new Date().toString()
			const message = `Phonebook has info for ${count} people Time: ${currentTime}`
			res.send(message)
		})
		.catch(error => next(error))
})

// Handle unknown endpoints
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint!' })
}
app.use(unknownEndpoint)

// Error handling middleware
const errorHandler = (error, req, res, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'Malformatted id!' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}

	next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})
