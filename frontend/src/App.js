import { useState, useEffect } from 'react'
import phonebook from './comms/phonebook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPen, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
//import utils from './utils'

//const capitalizeName = utils.capitalizeName

const Notification = ({ message }) => {
	if (message === null) {
		return null
	}

	return (
		<div className="message">
			{message}
		</div>
	)
}

const SearchFilter = ({ handleSearchChange, searchInput, className }) => {
	return (
		<div>
      		<input type="text" placeholder="Name..." value={searchInput} onChange={handleSearchChange} className={className} />
		</div>
	)
}

const Persons = ({ contacts, setPersons, setMessage }) => {
	const handleDelete = (id) => {
		const toBeDeleted = contacts.find(c => c.id === id)
		console.log(id)
		if (window.confirm(`Delete ${toBeDeleted.name} ?`)) {
			phonebook
				.deleteOp(id)
				.then(() => {
					setPersons(contacts.filter((contact) => contact.id !== id))
					setMessage(`${toBeDeleted.name} was successfully deleted!`)
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				})
		}
	}
	console.log('render', contacts.length, 'persons')
	return (
		<div className="contacts-scrollbar">
		  <ul className="contacts-list">
			{contacts
			.sort((a, b) => a.name.localeCompare(b.name))
			.map(contact => (
			  <li key={contact.id} className="contact-item">
			  <span className="contact-name">{contact.name}</span>
			  <span className="contact-number">{contact.number}</span>
			  <span className="contact-email">{contact.email}</span>
			  <div className="button-group">
				<button onClick={() => handleDelete(contact.id)} className="edit-button">
				  <FontAwesomeIcon icon={faPen} size="xs" />
				</button>
				<button onClick={() => handleDelete(contact.id)} className="delete-button">
				  <FontAwesomeIcon icon={faTrashAlt} size="xs" />
				</button>
			  </div>
			</li>
			))}
		  </ul>
		</div>
	  );	  
}

const FormAddNewContact = ({ addContact, newName, handleNameChange, newNumber, handleNumberChange, newEmail, handleEmailChange, showForm, setShowForm }) => {
	return (
		<div className="form-container">
			<form onSubmit={addContact} className="form-add-new-contact">
				<div>
					Name: <input value={newName} onChange={handleNameChange} />
				</div>
				<div>
					Number: <input value={newNumber} onChange={handleNumberChange} />
				</div>
				<div>
					E-mail: <input value={newEmail} onChange={handleEmailChange} />
				</div>
				<div>
					<button type="submit"><b>add</b></button>
					<button onClick={() => setShowForm(!showForm)}><b>close</b></button>
				</div>
			</form>
		</div>
	);
};

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('')
	const [newNumber, setNewNumber] = useState('')
	const [newEmail, setNewEmail] = useState('')
	const [searchInput, setSearchInput] = useState('')
	const [message, setMessage] = useState(null)
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		console.log('effect')
		phonebook
			.getAll()
			.then(response => {
				console.log('promise fulfilled', response.data)
				setPersons(response.data)
			})
	}, [])

	const addContact = (event) => {
		event.preventDefault()
		const personObject = {
			name: newName,
			number: newNumber,
			email: newEmail,
			id: persons.length+1
		}
		if (persons.some(person => person.name === newName)){
			console.log(personObject)
			alert(`Contact ${newName} already exists!`)
			setNewName('')
			setNewNumber('')
			setNewEmail('')
			return
		} else {
			console.log(personObject)
			phonebook
				.add(personObject)
				.then(response => {
					setPersons(persons.concat(personObject))
					setNewName('')
					setNewNumber('')
					setNewEmail('')
					setShowForm(false)
					setMessage(`${newName} was successfully added to the phonebook!`)
					setTimeout(() => {
						setMessage(null)
					}, 5000)
					console.log(response)
				})
				.catch(error => {
					console.log(error.response.data)
					setMessage(error.response.data.error)
					setNewName('')
					setNewNumber('')
					setNewEmail('')
					setTimeout(() => {
						setMessage(null)
					}, 5000)
				})
		}
	}

	const handleNameChange = (event) => {
		event.preventDefault()
		console.log(event.target.value)
		setNewName(event.target.value)
	}

	const handleNumberChange = (event) => {
		event.preventDefault()
		console.log(event.target.value)
		setNewNumber(event.target.value)
	}

	const handleEmailChange = (event) => {
		event.preventDefault()
		console.log(event.target.value)
		setNewEmail(event.target.value)
	}

	const handleSearchChange = (event) => {
		event.preventDefault()
		console.log(event.target.value)
		setSearchInput(event.target.value)
	}

	const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase()))

	return (
		<>
		<h1>CONTACT BOOK</h1>
		<div className="bar-container">
			<div className="bar">
				<h2>Your contacts</h2>
				<SearchFilter handleSearchChange={handleSearchChange} searchInput={searchInput} className="search-bar"/>
				<button onClick={() => setShowForm(!showForm)} className="new-button" >
					<FontAwesomeIcon icon={faPlus} size="xs" />
				</button>
			</div>
		</div>
			<Notification message={message} />
		<div className="content">
			<Persons contacts={filteredPersons} setPersons={setPersons} setMessage={setMessage} />
		</div>
		  <div className={`container ${showForm ? 'dimmed-background' : ''}`}>
			  {showForm && (
				<FormAddNewContact
				  addContact={addContact}
				  newName={newName}
				  handleNameChange={handleNameChange}
				  newNumber={newNumber}
				  handleNumberChange={handleNumberChange}
				  handleEmailChange={handleEmailChange}
				  showForm={showForm}
				  setShowForm={setShowForm}
				/>
			  )}
		  </div>
		</>
	  );
}

export default App
