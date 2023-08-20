import { useState, useEffect } from 'react'
import phonebook from './comms/phonebook'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch, faPlus, faPen, faTrashAlt, faCircleUser, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { formatPhoneNumber } from './utils';

const Notification = ({ message, setMessage }) => {
    if (message === null) {
        return null;
    }

    return (
        <div className="message">
            <div className="message-content">
                {message}
            </div>
            <button className="ok-button" onClick={() => setMessage(null)}>
                Confirm
            </button>
        </div>
    );
};

const SearchFilter = ({ handleSearchChange, searchInput }) => {
    return (
        <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
                type="text"
                placeholder="Name..."
                value={searchInput}
                onChange={handleSearchChange}
				className="search-input"
            />
        </div>
    );
};

const Persons = ({ contacts, setPersons, showMessage, editContact }) => {
    const handleDelete = (id) => {
        const toBeDeleted = contacts.find((c) => c.id === id);
        console.log(id);
        if (window.confirm(`Are you sure you want to delete contact ${toBeDeleted.name}?`)) {
            phonebook.deleteOp(id).then(() => {
                setPersons(contacts.filter((contact) => contact.id !== id));
                showMessage(`${toBeDeleted.name} was successfully deleted!`);
            });
        }
    };

    console.log("render", contacts.length, "persons");
    const zeroResults = contacts.length === 0;

    return (
        <div className="contacts-flexbox">
            <ul className="contacts-list">
                {zeroResults ? (
                    <li className="contact-not-found">The inquiry provided zero results :-(</li>
                ) : (
                    <>
                        <li className="contact-icons">
                            <span className="icon-text">Name</span>
                            <FontAwesomeIcon icon={faCircleUser} className="person-icon" />
                            <span className="icon-text">Number</span>
                            <FontAwesomeIcon icon={faPhone} className="phone-icon" />
                            <span className="icon-text">E-mail</span>
                            <FontAwesomeIcon icon={faEnvelope} className="mail-icon" />
                        </li>
                        {contacts
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((contact) => (
                                <li key={contact.id} className="contact-item">
                                    <span className="contact-name">{contact.name}</span>
                                    <span className="contact-number">
                                        <a href={`tel:${contact.number}`} className="link-style">
                                            {formatPhoneNumber(contact.number)}
                                        </a>
                                    </span>
                                    <span className="contact-email">
                                        <a href={`mailto:${contact.email}`} className="link-style">
                                            {contact.email}
                                        </a>
                                    </span>
                                    <div className="button-group">
                                        <button
                                            onClick={() => editContact(contact)}
                                            className="edit-button"
                                        >
                                            <FontAwesomeIcon icon={faPen} size="xs" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(contact.id)}
                                            className="delete-button"
                                        >
                                            <FontAwesomeIcon icon={faTrashAlt} size="xs" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        }

                    </>
                )}
            </ul>
        </div>
    );
};

const FormAddNewContact = ({
    addContact,
    editContact,
    selectedContact,
    newName,
    handleNameChange,
    newNumber,
    handleNumberChange,
    newEmail,
    handleEmailChange,
    showForm,
    setShowForm,
    task,
    clearFields,
    clearErrorMessages,
    saveEditedContact,
    nameValidationMessage,
    numberValidationMessage,
    emailValidationMessage
}) => {
    const isEditTask = task === 'edit';
    const headingText = isEditTask ? 'Edit contact' : 'Add new contact';
    const initialName = isEditTask ? selectedContact.name : '';
    const initialNumber = isEditTask ? selectedContact.number : '';
    const initialEmail = isEditTask ? selectedContact.email : '';

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isEditTask) {
            saveEditedContact(event);
        } else {
            addContact(event);
        }
    };

    const handleCancel = () => {
        clearFields();
        clearErrorMessages();
        setShowForm(false);
    };

    return (
        <div className="form-container">
            {showForm && (
                <form onSubmit={handleSubmit} className="form-add-new-contact">
                    <div className="form-heading">{headingText}</div>
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="name">Name*</label>
                            <input
                                type="text"
                                id="name"
                                placeholder="John Appleseed"
                                value={isEditTask ? initialName : newName}
                                onChange={handleNameChange}
                            />
                        </div>
                        {nameValidationMessage && (
                            <div className="validation-message">{nameValidationMessage}</div>
                        )}
                    </div>
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="number">Number*</label>
                            <input
                                type="text"
                                id="number"
                                placeholder="040 123 4567"
                                value={isEditTask ? initialNumber : newNumber}
                                onChange={handleNumberChange}
                            />
                        </div>
                        {numberValidationMessage && (
                            <div className="validation-message">{numberValidationMessage}</div>
                        )}
                    </div>
                    <div className="form-field-container">
                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="john@example.com"
                                value={isEditTask ? initialEmail : newEmail}
                                onChange={handleEmailChange}
                            />
                        </div>
                        {emailValidationMessage && (
                            <div className="validation-message">{emailValidationMessage}</div>
                        )}
                    </div>
                    <div className="form-button-group">
                        <button className="cancel-button" onClick={handleCancel}>
                            <b>Cancel</b>
                        </button>
                        <button className="save-button" type="submit">
                            <b>Save</b>
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [message, setMessage] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [nameValidationMessage, setNameValidationMessage] = useState('');
    const [numberValidationMessage, setNumberValidationMessage] = useState('');
    const [emailValidationMessage, setEmailValidationMessage] = useState('');

    useEffect(() => {
        console.log('effect');
        phonebook
            .getAll()
            .then(response => {
                console.log('promise fulfilled', response.data);
                setPersons(response.data);
            });
    }, []);

    const addContact = (event) => {
        event.preventDefault();
        const personObject = {
            name: newName,
            number: newNumber,
            email: newEmail,
            id: persons.length + 1,
        };
    
        const validationMessage = validateContact(personObject);
    
        if (validationMessage) {
            // alert(validationMessage);
            return;
        }
    
        if (persons.some((person) => person.name === newName)) {
            console.log(personObject);
            alert(`Contact ${newName} already exists!`);
            return;
        }
    
        console.log(personObject);
        phonebook
            .add(personObject)
            .then((response) => {
                // Fetch the updated list of contacts from the server
                phonebook.getAll().then((response) => {
                    setPersons(response.data);
                    clearFields();
                    setShowForm(false);
                    showMessage(`${newName} was successfully added to contacts!`);
                });
                console.log(response);
            })
            .catch((error) => {
                handleErrorResponse(error);
            });
    };
    
    const validateContact = (contact) => {
        let nameMessage = '';
        let numberMessage = '';
        let emailMessage = '';
    
        if (contact.name.length === 0) {
            nameMessage = 'Name is a mandatory field!'
        } else if (contact.name.length < 3) {
            nameMessage = 'Name must be at least 3 characters long!';
        }

        if (contact.number.length === 0) {
            numberMessage = "Number is a mandatory field!";
        } else if (!/^[0-9+\-()\s#*]+$/.test(contact.number)) {
            numberMessage = 'Invalid phone number format!';
        }
    
        if (contact.email && !/^\S+@\S+\.\S+$/.test(contact.email)) {
            emailMessage = 'Invalid email format!';
        }
    
        setNameValidationMessage(nameMessage);
        setNumberValidationMessage(numberMessage);
        setEmailValidationMessage(emailMessage);
    
        if (nameMessage || numberMessage || emailMessage) {
            return 'Validation failed'; // Return a general validation failure message
        }
    
        return null; // Validation successful
    };

    const editContact = (contact) => {
        setSelectedContact(contact); // Pass the entire contact object
        setShowForm(true); // Show the form when editing
    };

    const saveEditedContact = (event) => {
		event.preventDefault();
	
		const updatedContact = {
			...selectedContact,
			name: event.target.name.value,
			number: event.target.number.value,
			email: event.target.email.value,
		};

        const validationMessage = validateContact(updatedContact);

        if (validationMessage) {
            // alert(validationMessage);
            return;
        }

		console.log(updatedContact.id)
	
		phonebook
			.saveOp(updatedContact.id, updatedContact)
			.then((data) => {
				updatePersonInList(data);
				setSelectedContact(null);
				clearFields(); // Clear the form fields
                setShowForm(false)
				showMessage("Contact saved!");
			})
			.catch((error) => {
				console.log(error);
			});
	};

    const clearFields = () => {
        setNewName("");
        setNewNumber("");
        setNewEmail("");
    };

    const clearErrorMessages = () => {
        setNameValidationMessage('')
        setNumberValidationMessage('')
        setEmailValidationMessage('')
    }

    const showMessage = (message) => {
        setMessage(message);
        setTimeout(() => {
            setMessage(null);
        }, 10000);
    };

    const handleErrorResponse = (error) => {
        console.log(error.response.data);
        showMessage(error.response.data.error);
        clearFields();
        setTimeout(() => {
            setMessage(null);
        }, 5000);
    };

    const updatePersonInList = (updatedPerson) => {
        setPersons((prevPersons) =>
            prevPersons.map((person) =>
                person.id === updatedPerson.id ? { ...person, ...updatedPerson } : person
            )
        );
    };

    const handleNameChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
		
		if (selectedContact) {
			// If editing, update the selectedContact's name
			const updatedContact = { ...selectedContact, name: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newName state
			setNewName(event.target.value);
		}
	};

	const handleNumberChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
	
		if (selectedContact) {
			// If editing, update the selectedContact's number
			const updatedContact = { ...selectedContact, number: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newNumber state
			setNewNumber(event.target.value);
		}
	};

	const handleEmailChange = (event) => {
		event.preventDefault();
		console.log(event.target.value);
	
		if (selectedContact) {
			// If editing, update the selectedContact's email
			const updatedContact = { ...selectedContact, email: event.target.value };
			setSelectedContact(updatedContact);
		} else {
			// If adding new contact, update the newEmail state
			setNewEmail(event.target.value);
		}
	};

    const handleSearchChange = (event) => {
        event.preventDefault();
        console.log(event.target.value);
        setSearchInput(event.target.value);
    };

    const handleNewContactClick = () => {
        setSelectedContact(null);
        setShowForm(true);
    };

    const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchInput.toLowerCase()));

    return (
        <>
            <h1>CONTACT BOOK</h1>
            <div className="bar-container">
                <div className="bar">
                    <h2>Your contacts</h2>
                    <SearchFilter handleSearchChange={handleSearchChange} searchInput={searchInput}/>
                    <button onClick={handleNewContactClick} className="new-button">
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                </div>
            </div>
            <div className="content">
                <Persons contacts={filteredPersons}
                    setPersons={setPersons}
                    showMessage={showMessage}
                    editContact={editContact}
                />
            </div>
            {showForm && (
				<div className={`container ${showForm ? 'dimmed-background' : ''}`}>
					<FormAddNewContact
						addContact={addContact}
						editContact={editContact}
						selectedContact={selectedContact}
						newName={newName}
						handleNameChange={handleNameChange}
						newNumber={newNumber}
						handleNumberChange={handleNumberChange}
						newEmail={newEmail}
						handleEmailChange={handleEmailChange}
						showForm={showForm}
						setShowForm={setShowForm}
						task={selectedContact ? 'edit' : 'add'}
						clearFields={clearFields}
                        clearErrorMessages={clearErrorMessages}
						saveEditedContact={saveEditedContact}
                        nameValidationMessage={nameValidationMessage}
                        numberValidationMessage={numberValidationMessage}
                        emailValidationMessage={emailValidationMessage}
					/>
				</div>
            )}
			<Notification 
                message={message}
                setMessage={setMessage} />
        </>
    );
};

export default App;
