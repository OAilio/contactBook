import { useState, useEffect } from 'react'
import phonebook from './comms/phonebook'

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

const SearchFilter = ({ handleSearchChange, searchInput }) => {
  return (
    <div>
      Search: <input value={searchInput}
      onChange={handleSearchChange}/>
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
          setPersons(contacts.filter((contact) => contact.id !== id));
          setMessage(`${toBeDeleted.name} was successfully deleted!`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
  }
}
console.log('render', contacts.length, 'persons')
  return(
    <div>
      {contacts.map(contact => (
        <p key={contact.id}>
          {contact.name} {contact.number} {''}
          <button onClick={() => handleDelete(contact.id)}>delete</button>
        </p>
      ))}
    </div>
  )
}

const FormAddNewContact = ({addContact, newName, handleNameChange, newNumber, handleNumberChange}) => {
  return (
    <form onSubmit={addContact}>
        <div>
          Name: <input value={newName}
          onChange={handleNameChange}/>
        </div>
        <div>
          Number: <input value={newNumber}
          onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit"><b>add</b></button>
        </div>
      </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [message, setMessage] = useState(null)

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
      id: persons.length+1
    }
    if (persons.some(person => person.name === newName)){
      console.log(personObject)
      alert(`Contact ${newName} already exists!`)
      setNewName('')
      setNewNumber('')
      return
    } else {
      console.log(personObject)
      phonebook
        .add(personObject)
        .then(response => {
          setPersons(persons.concat(personObject))
          setNewName('')
          setNewNumber('')
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

  const handleSearchChange = (event) => {
    event.preventDefault()
    console.log(event.target.value)
    setSearchInput(event.target.value)
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase()))

  return (
    <div>
      <h1>CONTACT BOOK</h1>
      <Notification message={message} />
      <SearchFilter handleSearchChange={handleSearchChange} searchInput={searchInput}/>
      <h2>Add New Contact</h2>
      <FormAddNewContact addContact={addContact} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons contacts={filteredPersons} setPersons={setPersons} setMessage={setMessage}/>
    </div>
  )

}

export default App
