const { response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const contact = require('./models/contact')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
	Contact.find({}).then(contacts => {
		res.json(contacts)
	})
		.catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
	Contact.findById(req.params.id).then(contact => {
		if (contact){
			res.json(contact)
		} else {
			res.status(404).end()
		}
	})
		.catch(error => next(error))
})

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


app.delete('/api/persons/:id', (req, res, next) => {
	Contact.findByIdAndRemove(req.params.id)
		.then(result => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

app.get('/info', (req, res, next) => {
	Contact.countDocuments({})
		.then(count => {
			const currentTime = new Date().toString()
			const message = `Phonebook has info for ${count} people Time: ${currentTime}`
			res.send(message)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'Unknown endpoint!' })
}
app.use(unknownEndpoint)

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